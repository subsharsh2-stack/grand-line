"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE = `🐌 *rings* BRRR BRRR~! Den Den Mushi here! I know everything about One Piece — ask me anything! Characters, arcs, lore, powers... or just need motivation to keep watching? I'm your snail! 🏴‍☠️`;

const SUGGESTED_QUESTIONS = [
  "Who is the strongest character?",
  "Which arc should I watch next?",
  "What are Devil Fruits?",
  "Is the filler worth watching?",
  "Why is Gear 5 so special?",
];

export function DenDenMushi() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_MESSAGE, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  async function sendMessage(text?: string) {
    const userMessage = (text || input).trim();
    if (!userMessage || isLoading) return;

    setInput("");
    const newMessages: Message[] = [
      ...messages,
      { role: "user" as const, content: userMessage, timestamp: new Date() },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "🐌 *static* Den Den Mushi lost signal... try again!",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "🐌 *static* Something went wrong! The Grand Line messes with signals...",
          timestamp: new Date(),
        },
      ]);
    }

    setIsLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{
          background: "linear-gradient(135deg, #0c4a6e, #082f49)",
          border: "2px solid rgba(245,166,35,0.4)",
          boxShadow: "0 0 20px rgba(245,166,35,0.3), 0 4px 20px rgba(0,0,0,0.5)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Den Den Mushi — Ask anything about One Piece"
      >
        <span className="text-2xl">🐌</span>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "#0a0e1a",
              border: "1px solid rgba(245,166,35,0.2)",
              maxHeight: "520px",
              boxShadow: "0 0 40px rgba(245,166,35,0.15), 0 20px 60px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]"
              style={{ background: "linear-gradient(135deg, #0c4a6e, #082f49)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <span className="text-xl">🐌</span>
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-void-950" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gold-400 font-display tracking-wider">
                    DEN DEN MUSHI
                  </div>
                  <div className="text-[9px] text-ocean-300/60">
                    One Piece AI · Powered by Groq
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={13} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: "340px" }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <span className="text-base mr-1.5 flex-shrink-0 self-end mb-1">🐌</span>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gold-500/20 text-gold-100 rounded-br-sm"
                        : "bg-void-800/80 text-slate-200 rounded-bl-sm border border-white/[0.06]"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🐌</span>
                  <div className="bg-void-800/80 border border-white/[0.06] px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 bg-slate-400 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions (only at start) */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
                {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-[10px] bg-void-800/60 border border-white/[0.08] text-slate-400 hover:text-gold-400 hover:border-gold-500/30 px-2.5 py-1 rounded-full transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-white/[0.06] flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything about One Piece..."
                className="flex-1 bg-void-800/60 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold-500/40 transition-all"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-void-950 transition-all flex-shrink-0"
              >
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
