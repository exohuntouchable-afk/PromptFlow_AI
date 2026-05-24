import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const CATEGORIES = [
  "Writing", "Image", "Code", "Business", "Social Media", "Video", "General"
];

export default function PromptBuilder({ session, onSave }) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [tone, setTone] = useState("professional");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [improveInput, setImproveInput] = useState("");
  const [improved, setImproved] = useState(null);
  const [improving, setImproving] = useState(false);

  async function handleGenerate() {
    if (!description.trim()) {
      setError("Please describe what you want.");
      return;
    }
    setLoading(true);
    setError("");
    setRecommendation(null);
    setDifficulty("");

    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, category, tone }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedPrompt(data.prompt);
      setRecommendation(data.recommendation);
      setDifficulty(data.difficulty);

      if (session) {
        await supabase.from("prompt_history").insert({
          user_id: session.user.id,
          user_description: description,
          generated_prompt: data.prompt,
          category: category,
        });
        onSave?.();
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  }

  async function handleImprove() {
    if (!improveInput.trim()) return;
    setImproving(true);
    setImproved(null);

    try {
      const res = await fetch("/api/improve-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: improveInput }),
      });
      const data = await res.json();
      setImproved(data);
    } catch (err) {
      setError("Failed to improve prompt.");
    }
    setImproving(false);
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const difficultyColor = {
    Beginner: "#22c55e",
    Intermediate: "#f59e0b",
    Advanced: "#ef4444",
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ color: "#f0f0f0", marginBottom: "1.5rem" }}>
        ✨ Generate Your Prompt
      </h2>

      {/* Category Selector */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#aaa", display: "block", marginBottom: "0.5rem" }}>
          Category
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "20px",
                border: "1px solid #2e2e2e",
                background: category === cat ? "#6c63ff" : "#1a1a1a",
                color: category === cat ? "white" : "#aaa",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#aaa", display: "block", marginBottom: "0.5rem" }}>
          What do you want to do?
        </label>
        <textarea
          rows={4}
          placeholder="e.g. Write a professional email asking for a meeting..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            background: "#1a1a1a",
            border: "1px solid #2e2e2e",
            borderRadius: "8px",
            color: "#f0f0f0",
            fontSize: "1rem",
            resize: "vertical",
          }}
        />
      </div>

      {/* Tone */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ color: "#aaa", display: "block", marginBottom: "0.5rem" }}>
          Tone
        </label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          style={{
            padding: "0.6rem 1rem",
            background: "#1a1a1a",
            border: "1px solid #2e2e2e",
            borderRadius: "8px",
            color: "#f0f0f0",
            fontSize: "0.95rem",
          }}
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="creative">Creative</option>
          <option value="technical">Technical</option>
          <option value="friendly">Friendly</option>
        </select>
      </div>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.9rem",
          background: loading ? "#333" : "#6c63ff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "2rem",
        }}
      >
        {loading ? "Generating..." : "Generate Prompt ✨"}
      </button>

      {/* Generated Result */}
      {generatedPrompt && (
        <div style={{
          background: "#1a1a1a",
          border: "1px solid #2e2e2e",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ color: "#f0f0f0", margin: 0 }}>Generated Prompt</h3>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {difficulty && (
                <span style={{
                  padding: "0.2rem 0.7rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  background: difficultyColor[difficulty] + "22",
                  color: difficultyColor[difficulty],
                  border: `1px solid ${difficultyColor[difficulty]}`,
                }}>
                  {difficulty}
                </span>
              )}
              <button
                onClick={() => handleCopy(generatedPrompt)}
                style={{
                  padding: "0.4rem 1rem",
                  background: copied ? "#22c55e" : "#252525",
                  color: "white",
                  border: "1px solid #2e2e2e",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <p style={{ color: "#f0f0f0", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
            {generatedPrompt}
          </p>

          {/* AI Recommendation */}
          {recommendation && (
            <div style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "#252525",
              borderRadius: "8px",
              borderLeft: "3px solid #6c63ff",
            }}>
              <p style={{ color: "#aaa", margin: 0, fontSize: "0.85rem" }}>
                🤖 <strong style={{ color: "#6c63ff" }}>Best AI for this: {recommendation.tool}</strong>
                <br />
                {recommendation.reason}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Prompt Improver */}
      <div style={{
        background: "#1a1a1a",
        border: "1px solid #2e2e2e",
        borderRadius: "12px",
        padding: "1.5rem",
      }}>
        <h3 style={{ color: "#f0f0f0", marginTop: 0 }}>🔧 Improve an Existing Prompt</h3>
        <textarea
          rows={3}
          placeholder="Paste any prompt here to improve it..."
          value={improveInput}
          onChange={(e) => setImproveInput(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            background: "#252525",
            border: "1px solid #2e2e2e",
            borderRadius: "8px",
            color: "#f0f0f0",
            fontSize: "0.95rem",
            resize: "vertical",
            marginBottom: "1rem",
          }}
        />
        <button
          onClick={handleImprove}
          disabled={improving}
          style={{
            padding: "0.6rem 1.5rem",
            background: improving ? "#333" : "#252525",
            color: "#6c63ff",
            border: "1px solid #6c63ff",
            borderRadius: "8px",
            cursor: improving ? "not-allowed" : "pointer",
            fontSize: "0.95rem",
          }}
        >
          {improving ? "Improving..." : "Improve Prompt 🔧"}
        </button>

        {improved && (
          <div style={{ marginTop: "1rem" }}>
            <p style={{ color: "#aaa", fontSize: "0.85rem" }}>
              ✅ <em>{improved.changes}</em>
            </p>
            <div style={{
              background: "#252525",
              borderRadius: "8px",
              padding: "1rem",
              position: "relative",
            }}>
              <p style={{ color: "#f0f0f0", lineHeight: "1.7", margin: 0 }}>
                {improved.improved}
              </p>
              <button
                onClick={() => handleCopy(improved.improved)}
                style={{
                  marginTop: "0.8rem",
                  padding: "0.4rem 1rem",
                  background: "#1a1a1a",
                  color: "white",
                  border: "1px solid #2e2e2e",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                Copy Improved Prompt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}