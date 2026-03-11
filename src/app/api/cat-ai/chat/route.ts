import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/cat-ai-knowledge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DASHSCOPE_API_KEY is not configured in .env" },
        { status: 500 }
      );
    }

    // Format messages for DashScope
    const messages = [
      { role: "system", content: buildSystemPrompt() },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen3.5-flash",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("DashScope API Error Response:", errorData);
      return NextResponse.json(
        { 
          error: `Alibaba API Error: ${response.status} ${response.statusText}`, 
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      data: {
        response: responseText,
        typingDelay: 0,
        model: "qwen3.5-flash",
      },
    });
  } catch (error: any) {
    console.error("Cat AI API Error:", error);
    return NextResponse.json(
      { error: "Failed to process message", details: error.message },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Cat AI API is running! 🐱 (Powered by Alibaba Qwen)",
    model: "qwen3.5-flash",
  });
}
