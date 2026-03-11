"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Cat, Sparkles, X, MessageCircle, ChevronRight } from "lucide-react";
import { CatAIChat } from "@/components/CatAIChat";

interface FloatingActionMenuProps {
  className?: string;
}

export function FloatingActionMenu({ className }: FloatingActionMenuProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notificationText, setNotificationText] = useState("Halo! bingung? sini tanya aku.");
  const [isHovered, setIsHovered] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  // Toggle notification text between two messages
  useEffect(() => {
    const messages = [
      "Halo! bingung? sini tanya aku.",
      "Aku Cat AI, konsultan buat kamu!",
      "✨ Gratis konsultasi 24/7",
      "🐱 Ada yang bisa dibantu?"
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      setNotificationText(messages[currentIndex]);
      
      // Add subtle pulse effect when text changes
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Ripple effect */}
        <AnimatePresence>
          {showRipple && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-full bg-primary/30"
            />
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={() => setIsChatOpen(true)}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center relative",
            "bg-gradient-to-br from-primary to-orange-500 text-white",
            "hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]",
            "transition-all duration-300 ease-out",
            className
          )}
        >
          {/* Animated rings */}
          <motion.div
            animate={{
              scale: isHovered ? 1.2 : 1,
              opacity: isHovered ? 0 : 0.3,
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-white/30"
          />
          
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.div
                  key="sparkles"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="h-8 w-8" />
                </motion.div>
              ) : (
                <motion.div
                  key="cat"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Cat className="h-8 w-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Notification Bubble with Tail */}
          <motion.div
            initial={{ scale: 0, x: 20, y: -20 }}
            animate={{ scale: 1, x: 0, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: 1 
            }}
            className="absolute -top-12 right-0 w-auto min-w-[140px] max-w-[200px]"
          >
            {/* Bubble tail */}
            <div className="absolute -bottom-1 right-4 w-3 h-3 bg-red-500 rotate-45" />
            
            {/* Bubble content */}
            <div className="relative bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg overflow-hidden">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]"
              />
              <div className="relative px-3 py-2 flex items-center gap-1">
                <MessageCircle className="h-3 w-3 text-white/80 flex-shrink-0" />
                <motion.span
                  key={notificationText}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-white font-medium truncate"
                >
                  {notificationText}
                </motion.span>
              </div>
            </div>
          </motion.div>
        </motion.button>

        {/* Mini menu that appears on hover */}
        <AnimatePresence>
          {isHovered && !isChatOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute right-20 top-1/2 -translate-y-1/2 flex items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-background/80 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 shadow-lg"
              >
                <span className="text-xs font-medium whitespace-nowrap text-foreground">
                  Tanya Cat AI
                </span>
              </motion.div>
              <ChevronRight className="h-4 w-4 text-primary animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cat AI Chat Box - Now wider and not too tall */}
        <AnimatePresence mode="wait">
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4
              }}
              className="absolute bottom-full right-0 mb-4"
            >
              <motion.div 
                className="bg-card border border-border shadow-2xl rounded-3xl flex flex-col w-[300px] sm:w-[450px] overflow-hidden"
                layoutId="chat-container"
              >
                {/* Chat Header with animated gradient - More compact */}
                <motion.div 
                  className="bg-gradient-to-r from-primary to-orange-500 px-5 py-3.5 flex items-center justify-between flex-shrink-0 relative overflow-hidden"
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Animated background pattern */}
                  <motion.div
                    animate={{
                      x: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                  />
                  
                  <div className="flex items-center gap-3 relative">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    >
                      <Cat className="h-5 w-5 text-white" />
                    </motion.div>
                    <div>
                      <motion.h3 
                        className="font-bold text-white text-base"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Cat AI
                      </motion.h3>
                      <motion.p 
                        className="text-xs text-white/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Online • Siap membantu
                      </motion.p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => setIsChatOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:text-white/80 transition-colors relative"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </motion.div>
                
                {/* Chat Content - Wider and more compact height */}
                <motion.div 
                  className="flex-1 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="h-[600px] overflow-y-auto px-4 py-2">
                    <CatAIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                  </div>
                </motion.div>

                {/* Footer hint - More compact */}
                <motion.div 
                  className="px-5 pb-3 text-center border-t border-border/50 pt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Tekan Enter untuk mengirim
                    <Sparkles className="h-3 w-3" />
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}