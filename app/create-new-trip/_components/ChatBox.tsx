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
    <div className="h-[85vh] flex flex-col">
      {messages.length === 0 && (
        <EmptyBoxState
          onSelectOption={(v: string) => onSend(v)}
        />
      )}

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-lg px-4 py-2 rounded-2xl ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {msg.content}

              {/* ✅ Dynamic UI */}
              {msg.role === "assistant" &&
                RenderGenerativeUi(msg.ui)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-2xl flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="max-w-lg bg-red-100 text-red-800 px-4 py-2 rounded-2xl">
              Error: {error}
            </div>
          </div>
        )}
      </section>

      {/* Input */}
      <section className="p-4">
        <div className="border rounded-2xl p-4 shadow-md relative">
          <Textarea
            placeholder="Start typing here..."
            className="w-full h-20 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            value={userInput}
            disabled={loading}
          />

          <Button
            size="icon"
            className="absolute bottom-6 right-6"
            onClick={() => onSend()}
            disabled={loading || !userInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;