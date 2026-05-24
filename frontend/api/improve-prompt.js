import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  const systemPrompt = `You are an expert AI prompt engineer. Improve the given prompt to make it clearer, more specific, and more effective. Return ONLY a valid JSON object:
{
  "improved": "the improved prompt text",
  "changes": "one sentence describing what you improved"
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Improve this prompt: ${prompt}` },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (error) {
    console.error("Groq error:", error);
    res.status(500).json({ error: "Failed to improve prompt." });
  }
}