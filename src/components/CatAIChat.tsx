"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlassButton } from "@/components/ui/glass";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Cat,
  Loader2,
  RotateCcw,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { suggestedQuestions, type ChatMessage } from "@/lib/cat-ai-knowledge";

interface CatAIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CatAIChat({ isOpen, onClose }: CatAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("cat-ai-chat-history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    } else {
      // Add welcome message if no history
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "Halo! 👋 Saya **Cat AI**, asisten virtual JastipKu! 🐱\n\nSenang bertemu kamu! Ada yang bisa saya bantu tentang JastipKu?\n\n**Saya bisa bantu dengan:**\n- Cara order\n- Biaya & fee\n- Trips yang tersedia\n- Status pengiriman\n- Dan masih banyak lagi!\n\nSilakan tanya apa aja! 😊",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("cat-ai-chat-history", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch("/api/cat-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      // Simulate typing delay
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data?.data?.response || "🐱 Meow! I'm having trouble thinking. Please try again!",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, data?.data?.typingDelay ?? 1000);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsTyping(false);
      setIsLoading(false);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "🐱 Maaf, terjadi kesalahan. Silakan coba lagi ya!",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const clearChat = () => {
    localStorage.removeItem("cat-ai-chat-history");
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Halo! 👋 Saya **Cat AI**, asisten virtual dan konsultan JastipKu! 🐱\n\nSenang bertemu kamu! Ada yang bisa saya bantu tentang JastipKu?",
        timestamp: new Date(),
      },
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  // Simple markdown-like parser for bold text
  const parseContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      // Parse bold text (**text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className={line.startsWith(" ") ? "pl-4" : ""}>
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={j} className="font-bold text-foreground">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 bg-muted/20 rounded-b-3xl">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 relative",
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border rounded-bl-md ml-10"
              )}
            >
              {message.role === "assistant" && (
                <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                  <Cat className="h-3 w-3 text-white" />
                </div>
              )}
              <div className="text-sm space-y-1 pl-0">
                {message.role === "assistant"
                  ? parseContent(message.content)
                  : message.content}
              </div>
              <p
                className={cn(
                  "text-xs mt-2 text-right",
                  message.role === "user"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 relative">
              <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                <Cat className="h-3 w-3 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="pb-2 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-xs text-muted-foreground">
              Pertanyaan yang sering ditanyakan:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <motion.button
                key={question}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
              >
                {question}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="pt-4 flex-shrink-0"
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya sesuatu tentang JastipKu..."
            className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            disabled={isLoading}
          />
          <GlassButton
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading || !input.trim()}
            className="px-4"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </GlassButton>
        </div>
      </form>
    </div>
  );
}
