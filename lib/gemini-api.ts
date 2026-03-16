import type { GeminiResponse, PlayerProfile, PersonalReflection } from "./types"

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
const MAX_RETRIES = 3
const BACKOFF_MS = 500

const ARTIFACT_FALLBACK: GeminiResponse = {
  quests: [
    {
      title: "Mindfulness and Focus",
      description: "Take 10 deep breaths and outline your top 3 goals for today.",
      type: "Daily",
      difficulty: "Easy",
      xp: 10,
      realm: "Emotional & Spiritual",
    },
    {
      title: "Physical Maintenance",
      description: "Complete a 15-minute home workout or stretching routine to build strength.",
      type: "Daily",
      difficulty: "Medium",
      xp: 25,
      realm: "Body & Discipline",
    },
  ],
  suggestions: {
    focusArea: "Body & Discipline",
    motivation: "A strong body fuels a sharp mind. Keep pushing forward!",
    emotionalGuidance: "Small disciplines repeated over time yield massive results.",
  },
}

function buildPrompt(player: PlayerProfile, reflection?: PersonalReflection) {
  const reflectionContext = reflection
    ? `
PERSONAL REFLECTION CONTEXT:
Current Mood: ${reflection.mood}
Emotional State: ${reflection.emotionalState}
Current Challenges: ${reflection.currentChallenges}
Motivation Level: ${reflection.motivationLevel}
Based on this reflection, generate quests that specifically address their emotional needs and current life situation.
`
    : ""

  return `
You are an AI RPG Quest Master for SoloLvlUp, a real-life gamification system. Generate personalized quests for a player with the following profile:

Level: ${player.level}
Rank: ${player.rank}
Total XP: ${player.totalXp}

${reflectionContext}

Generate quests across these 5 realms that respond to their inner world and external challenges:
1. Mind & Skill (boosts IQ, Technical Attribute, Problem Solving)
2. Emotional & Spiritual (boosts EQ)
3. Body & Discipline (boosts Strength)
4. Creation & Mission (boosts Aptitude)
5. Heart & Loyalty (boosts EQ, Strength)

Generate exactly 5 quests total: 3 Daily + 2 Normal.

Return ONLY a valid JSON response in this exact format:
{
  "quests": [
    {
      "title": "Specific actionable quest title",
      "description": "Detailed description of exactly what to do and how to complete it",
      "type": "Daily",
      "difficulty": "Easy",
      "xp": 10,
      "realm": "Mind & Skill"
    }
  ],
  "suggestions": {
    "focusArea": "The stat area the player should focus on most based on their current stats and reflection",
    "motivation": "Personalized motivational message based on their level, progress, and emotional state",
    "emotionalGuidance": "Specific guidance to help them navigate their current emotional situation"
  }
}
`
}

export async function generateQuests(
  playerProfile: PlayerProfile,
  reflection?: PersonalReflection,
): Promise<GeminiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  
  try {
    const res = await fetch(`${baseUrl}/api/quests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: playerProfile, reflection }),
    })

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    return (await res.json()) as GeminiResponse
  } catch (error) {
    console.error("Error generating quests:", error)
    return ARTIFACT_FALLBACK
  }
}

export async function getGeminiInsight(prompt: string, playerProfile?: PlayerProfile): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  
  try {
    const body = playerProfile ? { prompt, player: playerProfile } : { prompt }
    const res = await fetch(`${baseUrl}/api/gemini-nlp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }
    
    const data = await res.json()
    return data.reply || "No insight available."
  } catch (error) {
    console.error("Error getting Gemini insight:", error)
    return "Sorry, I couldn't get a real-time insight right now."
  }
}
