import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Trip Planner",
  },
});

const PROMPT = `
You are an AI Trip Planner Agent.

Ask ONE question at a time in a conversational tone.

You must follow this STRICT order:
1. source
2. destination
3. groupSize
4. budget
5. tripDuration
6. interests
7. final itinerary

Return STRICT JSON only:

{
  "resp": "text response",
  "ui": "source | destination | groupSize | budget | tripDuration | interests | final"
}

Do not include markdown.
Do not include extra text.
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

    // 🔥 Count user answers
    const userMessages = messages.filter(
      (m: any) => m.role === "user"
    );

    const step = userMessages.length;

    // 🔥 Determine correct UI step deterministically
    const stepMap: Record<number, string> = {
      0: "source",
      1: "destination",
      2: "groupSize",
      3: "budget",
      4: "tripDuration",
      5: "interests",
      6: "final",
    };

    const forcedUI = stepMap[step] ?? "final";

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: PROMPT },
        ...messages,
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: content },
        { status: 500 }
      );
    }

    // 🔥 OVERRIDE UI (THIS FIXES EVERYTHING)
    parsed.ui = forcedUI;

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("AI MODEL ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}