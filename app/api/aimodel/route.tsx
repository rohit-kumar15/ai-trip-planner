import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // change after deploy
    "X-Title": "AI Trip Planner",
  },
});

const PROMPT = `You are an AI Trip Planner Agent.

Your goal is to help the user plan a trip by asking exactly ONE relevant trip-related question at a time.
You must strictly follow the order of questions listed below and wait for the user’s answer before asking the next question.

Question Order (STRICT):
1. Starting location (source)
2. Destination city or country
3. Group size (Solo, Couple, Family, Friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)
6. Travel interests (adventure, sightseeing, cultural, food, nightlife, relaxation)
7. Special requirements or preferences (if any)

Rules:
- NEVER ask more than one question in a single response.
- NEVER skip or reorder questions.
- NEVER ask irrelevant questions.
- If the user’s answer is missing, unclear, or invalid, politely ask the user to clarify before proceeding.
- Always maintain a friendly, conversational, and interactive tone.

Generative UI Rule:
- Every response MUST specify which UI component to display.
- Allowed UI values are strictly:
  "source", "destination", "groupSize", "budget", "tripDuration", "interests", "final"

Final Output Rule:
- Once ALL required information is collected, generate the complete trip itinerary.
- The final response MUST be returned as STRICT JSON ONLY.
- Do NOT include explanations, markdown, comments, or extra text outside JSON.

Response Format (MANDATORY):
{
  "resp": "Text response to show the user",
  "ui": "source | destination | groupSize | budget | tripDuration | interests | final"
}

JSON Validation Rules:
- Response MUST be valid JSON.
- Keys must be exactly "resp" and "ui".
- Do NOT add extra keys.
- Do NOT return text outside JSON.
- "ui" must match one of the allowed values exactly.
- Escape quotes correctly.
- When generating the final itinerary, set "ui" to "final".

Start the trip planning conversation by asking the first question based on the required order.
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      response_format: {type:'json_object'},
      messages: [
        { 
          role: "system", 
          content: PROMPT 
        },
        ...messages,
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    // ✅ SAFE JSON PARSING
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: content },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI MODEL ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
