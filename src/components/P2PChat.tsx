"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MoreVertical, Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  text?: string;
  image?: string;
  timestamp: string;
  isRead: boolean;
  type: "text" | "image" | "system";
}

interface P2PChatProps {
  orderId: string;
  currentUser: { id: string; name: string; avatar: string };
  otherUser: { id: string; name: string; avatar: string; role: string };
}

const replyTemplates: Record<string, string[]> = {
  Jastiper: [
    "Oke Kak, saya update lagi ya.",
    "Barangnya ready, saya kirim foto detailnya.",
    "Siap, nanti saya kirim struk dan info lanjutannya.",
  ],
  Buyer: [
    "Sip, ditunggu update berikutnya ya.",
    "Boleh, kalau sudah ready kabari ya.",
    "Terima kasih, saya tunggu infonya.",
  ],
};

function formatTime() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function P2PChat({ orderId, currentUser, otherUser }: P2PChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const replyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const participantKey = [currentUser.id, otherUser.id].sort().join("-");
  const storageKey = `p2p-chat-${orderId}-${participantKey}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
          return;
        }
      } catch {
        // Ignore and seed below.
      }
    }

    setMessages([
      {
        id: "1",
        senderId: otherUser.id,
        text: `Halo Kak ${currentUser.name}! Saya sudah di store nih. Barangnya ready semua ya.`,
        timestamp: "09:00",
        isRead: true,
        type: "text",
      },
      {
        id: "2",
        senderId: otherUser.id,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
        timestamp: "09:02",
        isRead: true,
        type: "image",
      },
      {
        id: "3",
        senderId: otherUser.id,
        text: "Ini fotonya ya Kak untuk verifikasi. Kondisi box mulus!",
        timestamp: "09:03",
        isRead: true,
        type: "text",
      },
    ]);
  }, [storageKey, currentUser.name, otherUser.id]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      if (replyTimeout.current) {
        clearTimeout(replyTimeout.current);
      }
    };
  }, []);

  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: trimmed,
      timestamp: formatTime(),
      isRead: false,
      type: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    if (replyTimeout.current) clearTimeout(replyTimeout.current);

    typingTimeout.current = setTimeout(() => setIsTyping(true), 500);
    replyTimeout.current = setTimeout(() => {
      setIsTyping(false);
      const candidates = replyTemplates[otherUser.role] || replyTemplates.Jastiper;
      const replyText = candidates[Math.floor(Math.random() * candidates.length)];
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: otherUser.id,
        text: replyText,
        timestamp: formatTime(),
        isRead: true,
        type: "text",
      };

      setMessages((prev) => {
        const marked = prev.map((msg) =>
          msg.senderId === currentUser.id ? { ...msg, isRead: true } : msg
        );
        return [...marked, reply];
      });
    }, 2000);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="flex flex-col h-[600px] bg-card border rounded-[2rem] overflow-hidden shadow-2xl">
      <div className="p-5 border-b bg-muted/30 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={otherUser.avatar} />
              <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">{otherUser.name}</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mt-1">
              {otherUser.role} Online
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <MoreVertical className="h-5 w-5 opacity-50" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-muted/20">
        <div className="flex justify-center">
          <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest text-muted-foreground bg-muted/20 border-0 py-1.5 px-4 rounded-full">
            Safe Chat Secured by JastipKu
          </Badge>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex flex-col", isMe ? "items-end" : "items-start")}
              >
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-background border border-border rounded-bl-md"
                  )}
                >
                  {msg.type === "image" ? (
                    <div className="space-y-2">
                      <img
                        src={msg.image}
                        alt="Verification"
                        className="rounded-2xl max-h-[240px] object-cover"
                      />
                      <p className="text-[10px] opacity-70 italic font-medium">
                        Visual verification proof
                      </p>
                    </div>
                  ) : (
                    <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
                <div className={cn("flex items-center gap-1.5 mt-1 px-1", isMe ? "justify-end" : "justify-start")}>
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">
                    {msg.timestamp}
                  </span>
                  {isMe && (
                    msg.isRead ? (
                      <CheckCheck className="h-3 w-3 text-primary" />
                    ) : (
                      <Check className="h-3 w-3 text-muted-foreground" />
                    )
                  )}
                </div>
              </motion.div>
            );
          })}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-start"
            >
              <div className="bg-background border border-border p-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter mt-1.5 px-1">
                {otherUser.name} is typing...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-6 pt-3 border-t bg-card">
        <div className="flex items-center gap-3 bg-muted/40 p-2 pl-4 rounded-[1.5rem] border border-muted focus-within:border-primary/30 focus-within:bg-background transition-all">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 shadow-none font-medium text-sm"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim()}
            className="h-10 w-10 bg-primary text-white rounded-xl shadow-lg hover:scale-105 transition-transform"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em] mt-4 opacity-50">
          Your conversation is encrypted and used for transaction dispute resolution.
        </p>
      </form>
    </div>
  );
}
