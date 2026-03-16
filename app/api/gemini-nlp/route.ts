import { type NextRequest, NextResponse } from "next/server"
import type { PlayerProfile } from "@/lib/types"

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
const MAX_RETRIES = 3
const BACKOFF_MS = 500

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

const baseSystemPrompt = `You are Arise, the Solo Leveling System—a loyal, supportive, and sometimes witty companion to the Hunter. Always reply in the style of the Solo Leveling RPG system: formal, concise, but also encouraging, motivational, and a little playful when appropriate. You are the Hunter's AI buddy, helping them level up, celebrating their victories, and nudging them forward. Never break character. Respond as the System, but with warmth and engagement.`

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { prompt: string; player?: PlayerProfile }
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500, headers: corsHeaders })
    }

    let payload
    if (!body.player) {
      // General chat: system prompt + user message
      payload = {
        contents: [{ parts: [{ text: `${baseSystemPrompt}\nUser: ${body.prompt}` }] }],
      }
    } else {
      // If player.name is present, add it to the prompt context
      const nameContext = body.player.name
        ? `The Hunter's name is: ${body.player.name}. Always use this name for personalization if the user asks about their name or refers to themselves as Hunter.`
        : ""
      const analyticsPrompt = `${baseSystemPrompt} ${nameContext} Use the player's stats to provide personalized, in-universe feedback, encouragement, or analysis. When given a user command or question, analyze it and return a JSON object with: 'reply' (Solo Leveling system style), 'intent' (one of: generate_quest, show_stats, add_reflection, motivation, quote, switch_tab, none), and optional 'reflection' (if the user shares a reflection), and optional 'tab' (if the user wants to switch tabs). Only return valid JSON.`
      payload = {
        contents: [
          {
            parts: [
              { text: `${analyticsPrompt}\nPlayer: ${JSON.stringify(body.player, null, 2)}\nUser: ${body.prompt}` },
            ],
          },
        ],
      }
    }

    let attempt = 0
    while (attempt < MAX_RETRIES) {
      const googleRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (googleRes.ok) {
        const data = (await googleRes.json()) as any
        if (!body.player) {
          // General chat: just return the reply
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply."
          return NextResponse.json({ reply }, { headers: corsHeaders })
        } else {
          // Analytics: parse JSON from reply
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}"
          const jsonMatch = raw.match(/\{[\s\S]*\}/)
          const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { reply: "Command received, Master.", intent: "none" }
          return NextResponse.json(parsed, { headers: corsHeaders })
        }
      }
      if (googleRes.status !== 503) {
        return NextResponse.json({ error: "Gemini API error" }, { status: googleRes.status, headers: corsHeaders })
      }
      await new Promise((r) => setTimeout(r, BACKOFF_MS * (attempt + 1)))
      attempt++
    }
    return NextResponse.json({ reply: "System is currently unavailable." }, { status: 200, headers: corsHeaders })
  } catch (error) {
    console.error("Error in gemini-nlp API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500, headers: corsHeaders })
  }
}
