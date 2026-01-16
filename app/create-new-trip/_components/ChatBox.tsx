"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send } from "lucide-react";
import EmptyBoxState from "./EmptyBoxState";

type Message = {
  role: string;
  content: string;
};

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const onSend = async () => {
    if (!userInput?.trim()) return;

    setError("");
    const userMessage = userInput;
    setUserInput("");
    setLoading(true);

    // Add user message to UI immediately
    const newUserMsg: Message = {
      role: "user",
      content: userMessage,
    };

    // Update messages state first
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    try {
      // Pass the full updated messages array to the API
      const response = await fetch("/api/aimodel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle multiple response formats from your API
      const responseText = data?.text || data?.resp || data?.response || data?.message;
      
      if (responseText) {
        const assistantMsg: Message = {
          role: "assistant",
          content: responseText,
        };
        setMessages((prev: Message[]) => [...prev, assistantMsg]);
      } else {
        setError("No response received from AI");
        console.error("Unexpected response format:", data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("API Error:", err);
      
      // Remove the user message if the API call failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
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
      {messages?.length === 0 &&
        <EmptyBoxState 
        onSelectOption={(v:string) => {setUserInput(v); onSend()}} />
      }
      {/* Display Messages */}
      <section className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-lg px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="max-w-lg bg-red-100 text-red-800 px-4 py-2 rounded-lg">
              Error: {error}
            </div>
          </div>
        )}
      </section>

      {/* User Input */}
      <section className="p-4">
        <div className="border rounded-2xl p-4 shadow-md relative">
          <Textarea
            placeholder="Start typing here..."
            className="w-full h-20 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            value={userInput}
            disabled={loading}
          />

          <Button
            size="icon"
            className="absolute bottom-6 right-6 cursor-pointer"
            onClick={onSend}
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