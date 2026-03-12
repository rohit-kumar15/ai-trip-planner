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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserDetail } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";

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

function ChatBox({ onTripGenerated }: { onTripGenerated?: (data: TripInfo) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [tripData, setTripData] = useState<TripInfo | null>(null);
  const [tripLoading, setTripLoading] = useState(false);

  const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
  const { userDetail } = useUserDetail();

  const extractFormData = () => {
    const userMsgs = messages.filter((m) => m.role === "user");

    // Skip first message (it's the "Create New Trip" trigger, not trip data)
    return {
      origin: userMsgs[1]?.content || "",
      destination: userMsgs[2]?.content || "",
      group_size: userMsgs[3]?.content || "",
      budget: userMsgs[4]?.content || "",
      duration: userMsgs[5]?.content || "",
      interests: userMsgs[6]?.content || "",
    };
  };

  const generateTripPlan = async () => {
    if (tripLoading || tripData) return;

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

      // 🔥 Save Trip to Convex DB
      const tripId = uuidv4();

      await SaveTripDetail({
        tripId: tripId,
        tripDetail: plan,
        uid: userDetail?._id,
      });

      console.log("Trip saved successfully");

      // Notify parent component
      const tripResult: TripInfo = {
        budget: plan.budget || "",
        destination: plan.destination || "",
        duration: plan.duration || "",
        group_size: plan.group_size || "",
        origin: plan.origin || "",
        hotels: plan.hotels || [],
        itinerary: plan.itinerary || [],
      };
      setTripData(tripResult);
      onTripGenerated?.(tripResult);

    } catch (error) {
      console.error("Trip generation failed:", error);
    } finally {
      setTripLoading(false);
    }
  };

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];

    if (lastMsg?.ui === "final") {
      generateTripPlan();
    }
  }, [messages]);

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
        headers: {
          "Content-Type": "application/json",
        },
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

      <section className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth min-h-0">

        {messages.length === 0 && (
          <EmptyBoxState
            onSelectOption={(v: string) => onSend(v)}
          />
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user"
                ? "justify-end"
                : "justify-start"
              }`}
          >

            <div
              className={`max-w-lg px-6 py-4 rounded-2xl ${msg.role === "user"
                  ? "bg-gradient-to-br from-orange-500 to-pink-600 text-white"
                  : "glassmorphism text-gray-900 border border-white/50"
                }`}
            >

              <p>{msg.content}</p>

              {msg.role === "assistant" &&
                RenderGenerativeUi(msg.ui)}

            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="glassmorphism px-6 py-4 rounded-2xl flex items-center gap-3">
              <Loader className="h-5 w-5 animate-spin text-orange-500" />
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="bg-red-50 text-red-800 px-6 py-4 rounded-2xl">
              Error: {error}
            </div>
          </div>
        )}

      </section>

      <section className="shrink-0 p-4 md:p-6 border-t">

        <div className="glassmorphism rounded-2xl p-4 relative">

          <Textarea
            placeholder="Start typing here..."
            className="w-full h-24 pr-16 bg-transparent border-none resize-none"
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            value={userInput}
            disabled={loading}
          />

          <div className="absolute bottom-4 right-4">

            <Button
              size="icon"
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