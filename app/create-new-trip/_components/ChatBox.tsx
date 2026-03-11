"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send } from "lucide-react";
import EmptyBoxState from "./EmptyBoxState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDaysUi from "./SelectDaysUi";
import FinalUi from "./FinalUi";

// ✅ TripInfo Type
type TripInfo = {
  budget: string;
  destination: string;
  duration: string;
  group_size: string;
  origin: string;
  hotels: any;
  itinerary: any;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
};

// ✅ FINAL_PROMPT for trip plan generation
const FINAL_PROMPT = `Generate Travel Plan with give details, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, Place address, ticket Pricing, Time travel each of the location , with each day plan with best time to visit in JSON format.
Output Schema.
{
"trip_plan": {
"destination": "string",
"duration": "string",
"origin": "string",
"budget": "string",
"group_size": "string",
"hotels": [
{
"hotel_name": "string",
"hotel_address": "string",
"price_per_night": "string",
"hotel_image_url": "string",
"geo_coordinates": {
"latitude": "number",
"longitude": "number"
},
"rating": "number",
"description": "string"
}
],
"itinerary": [
{
"day": "number",
"day_plan": "string",
"best_time_to_visit_day": "string",
"activities": [
{
"place_name": "string",
"place_details": "string",
"place_image_url": "string",
"geo_coordinates": {
"latitude": "number",
"longitude": "number"
},
"place_address": "string",
"ticket_pricing": "string",
"time_travel_each_location": "string",
"best_time_to_visit": "string"
}
]
}
]
}
}
`;

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [tripData, setTripData] = useState<TripInfo | null>(null);
  const [tripLoading, setTripLoading] = useState(false);

  // ✅ Extract trip form data from chat messages
  const extractFormData = () => {
    const userMsgs = messages.filter((m) => m.role === "user");
    return {
      origin: userMsgs[0]?.content || "",
      destination: userMsgs[1]?.content || "",
      group_size: userMsgs[2]?.content || "",
      budget: userMsgs[3]?.content || "",
      duration: userMsgs[4]?.content || "",
      interests: userMsgs[5]?.content || "",
    };
  };

  // ✅ Generate trip plan using FINAL_PROMPT
  const generateTripPlan = async () => {
    if (tripLoading || tripData) return; // Prevent duplicate calls

    setTripLoading(true);
    try {
      const formData = extractFormData();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: FINAL_PROMPT,
          tripInfo: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate trip plan");
      }

      console.log("Generated Trip Plan:", data);

      // Store data using TripInfo type
      const plan = data.trip_plan || data;
      setTripData({
        budget: plan.budget || "",
        destination: plan.destination || "",
        duration: plan.duration || "",
        group_size: plan.group_size || "",
        origin: plan.origin || "",
        hotels: plan.hotels || [],
        itinerary: plan.itinerary || [],
      });
    } catch (error) {
      console.error("Trip generation failed:", error);
    } finally {
      setTripLoading(false);
    }
  };

  // ✅ Detect when "final" UI appears — auto-trigger trip generation
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === "final") {
      generateTripPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

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
        return (
          <FinalUi
            viewTrip={() => generateTripPlan()}
            loading={tripLoading}
            tripReady={!!tripData}
          />
        );

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