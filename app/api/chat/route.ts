import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY!,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Trip Planner",
    },
});

export async function POST(req: NextRequest) {
    try {
        const { prompt, tripInfo } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "user",
                    content: prompt + "\n\nTrip Details:\n" + JSON.stringify(tripInfo),
                },
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

        return NextResponse.json(parsed);
    } catch (error) {
        console.error("CHAT API ERROR:", error);
        return NextResponse.json(
            { error: "Failed to generate trip plan" },
            { status: 500 }
        );
    }
}
