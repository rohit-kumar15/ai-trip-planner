"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send } from "lucide-react";
import EmptyBoxState from "./EmptyBoxState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDaysUi from "./SelectDaysUi";
import FinalUi from "./FinalUi";

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
};

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // ✅ FIXED onSend
  const onSend = async (value?: string) => {
    const messageToSend = value ?? userInput;

    if (!messageToSend?.trim()) return;

    setError("");
    setLoading(true);
    setUserInput("");

    const newUserMsg: Message = {
      role: "user",
      content: messageToSend,
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/aimodel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data?.resp) {
        const assistantMsg: Message = {
          role: "assistant",
          content: data.resp,
          ui: data.ui,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setError("Invalid AI response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clean Generative UI Router
  const RenderGenerativeUi = (ui?: string) => {
    if (!ui) return null;

    switch (ui) {
      case "budget":
        return (
          <BudgetUi
            onSelectedOption={(v: string) => onSend(v)}
          />
        );

      case "groupSize":
        return (
          <GroupSizeUi
            onSelectedOption={(v: string) => onSend(v)}
          />
        );

      case "tripDuration":
        return (
          <SelectDaysUi
            onSelectedOption={(v: string) => onSend(v)}
          />
        );

      case "final":
        return <FinalUi viewTrip={() => console.log("View Trip")} />;

      default:
        return null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Messages & Empty State - Scrollable */}
      <section className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth min-h-0">
        {messages.length === 0 && (
          <EmptyBoxState
            onSelectOption={(v: string) => onSend(v)}
          />
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            <div
              className={`max-w-lg px-6 py-4 rounded-2xl transition-all duration-300 ${msg.role === "user" ? "bg-gradient-to-br from-orange-500 to-pink-600 text-white premium-shadow hover:shadow-2xl" : "glassmorphism text-gray-900 border border-white/50 hover:border-orange-300/50"}`}
            >
              <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>

              {/* ✅ Dynamic UI */}
              {msg.role === "assistant" &&
                RenderGenerativeUi(msg.ui)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
            <div className="max-w-lg glassmorphism text-gray-900 px-6 py-4 rounded-2xl flex items-center gap-3 border border-white/50">
              <Loader className="h-5 w-5 animate-spin text-orange-500" />
              <span className="text-sm md:text-base font-medium">Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="max-w-lg bg-red-50/80 backdrop-blur-sm text-red-800 px-6 py-4 rounded-2xl border border-red-200/50 shadow-lg">
              <p className="text-sm md:text-base">Error: {error}</p>
            </div>
          </div>
        )}
      </section>

      {/* Input - Always visible at bottom */}
      <section className="shrink-0 p-4 md:p-6 border-t border-white/10 bg-white/30 backdrop-blur-sm">
        <div className="glassmorphism glow-input rounded-2xl p-4 relative group hover-lift">
          <Textarea
            placeholder="Start typing here..."
            className="w-full h-24 pr-16 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none text-base placeholder:text-gray-500 placeholder:font-light"
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            value={userInput}
            disabled={loading}
          />

          <div className="absolute bottom-4 right-4">
            <Button
              size="icon"
              className="gradient-button-hover transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-2xl hover:-translate-y-1"
              onClick={() => onSend()}
              disabled={loading || !userInput.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;