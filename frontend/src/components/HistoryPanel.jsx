import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function HistoryPanel({ onSelect, refresh }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [refresh]);

  async function fetchHistory() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("prompt_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error) setHistory(data || []);
    setLoading(false);
  }

  async function deletePrompt(id, e) {
    e.stopPropagation();
    await supabase.from("prompt_history").delete().eq("id", id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }

  const categoryColors = {
    Writing: "#6c63ff",
    Image: "#ec4899",
    Code: "#22c55e",
    Business: "#f59e0b",
    "Social Media": "#3b82f6",
    Video: "#ef4444",
    General: "#888",
  };

  if (loading) return (
    <div style={{ color: "#888", padding: "1rem" }}>Loading history...</div>
  );

  if (history.length === 0) return (
    <div style={{ color: "#888", padding: "1rem" }}>No saved prompts yet.</div>
  );

  return (
    <div style={{
      background: "#1a1a1a",
      border: "1px solid #2e2e2e",
      borderRadius: "12px",
      padding: "1rem",
    }}>
      <h3 style={{ color: "#f0f0f0", marginTop: 0 }}>Prompt History</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {history.map((item) => (
          <li
            key={item.id}
            onClick={() => onSelect(item.generated_prompt)}
            style={{
              padding: "0.8rem",
              marginBottom: "0.5rem",
              background: "#252525",
              borderRadius: "8px",
              cursor: "pointer",
              border: "1px solid #2e2e2e",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {item.category && (
                  <span style={{
                    padding: "0.15rem 0.6rem",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    background: (categoryColors[item.category] || "#888") + "22",
                    color: categoryColors[item.category] || "#888",
                    border: `1px solid ${categoryColors[item.category] || "#888"}`,
                  }}>
                    {item.category}
                  </span>
                )}
                <span style={{ color: "#555", fontSize: "0.75rem" }}>
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={(e) => deletePrompt(item.id, e)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#555",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                ✕
              </button>
            </div>
            <p style={{
              color: "#aaa",
              margin: 0,
              fontSize: "0.85rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {item.user_description?.slice(0, 60)}...
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}