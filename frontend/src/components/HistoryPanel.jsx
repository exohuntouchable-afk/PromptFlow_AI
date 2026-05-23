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

  if (loading) return <div className="history-loading">Loading history...</div>;
  if (history.length === 0)
    return <div className="history-empty">No saved prompts yet.</div>;

  return (
    <div className="history-panel">
      <h3>Prompt History</h3>
      <ul className="history-list">
        {history.map((item) => (
          <li
            key={item.id}
            className="history-item"
            onClick={() => onSelect(item.generated_prompt)}
          >
            <div className="history-meta">
              <span className="history-date">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
              <button
                className="delete-btn"
                onClick={(e) => deletePrompt(item.id, e)}
                title="Delete"
              >
                ✕
              </button>
            </div>
            <p className="history-preview">
              {item.user_description?.slice(0, 80)}...
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}