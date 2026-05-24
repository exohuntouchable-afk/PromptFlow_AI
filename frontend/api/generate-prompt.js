import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { description, tone, useCase, category } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required." });
  }

  const systemPrompt = `You are an expert AI prompt engineer. Given a user's request, return ONLY a valid JSON object with no explanation, no markdown, no backticks. The JSON must have exactly these fields:
{
  "prompt": "the generated prompt text",
  "recommendation": {
    "tool": "best AI tool name",
    "reason": "one sentence why"
  },
  "difficulty": "Beginner or Intermediate or Advanced"
}`;

  const userMessage = `Generate for:
Description: ${description}
Category: ${category || "general"}
Tone: ${tone || "professional"}
Use case: ${useCase || "general"}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (error) {
    console.error("Groq error:", error);
    res.status(500).json({ error: "Failed to generate prompt." });
  }
}