import { useState } from "react"
import Navbar from "../components/Navbar"
import PromptBuilder from "../components/PromptBuilder"
import HistoryPanel from "../components/HistoryPanel"
import { supabase } from "../lib/supabaseClient"

export default function Dashboard({ session }) {
  const [showHistory, setShowHistory] = useState(false)
  const [refreshHistory, setRefreshHistory] = useState(0)
  const [selectedPrompt, setSelectedPrompt] = useState(null)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  function handleSelectFromHistory(prompt) {
    setSelectedPrompt(prompt)
    setShowHistory(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f" }}>
      <Navbar
        email={session.user.email}
        onSignOut={handleSignOut}
        onToggleHistory={() => setShowHistory(!showHistory)}
        showHistory={showHistory}
      />

      <div style={{
        display: "flex",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem 1rem",
        gap: "2rem",
      }}>
        <div style={{ flex: 1 }}>
          {selectedPrompt && (
            <div style={{
              background: "#1a1a1a",
              border: "1px solid #6c63ff",
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              marginBottom: "1.5rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: "#aaa", margin: 0, fontSize: "0.85rem" }}>
                  📋 Prompt loaded from history
                </p>
                <button
                  onClick={() => setSelectedPrompt(null)}
                  style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>
              <p style={{ color: "#f0f0f0", margin: "0.5rem 0 0", fontSize: "0.95rem", lineHeight: "1.6" }}>
                {selectedPrompt}
              </p>
            </div>
          )}

          <PromptBuilder
            session={session}
            onSave={() => setRefreshHistory(r => r + 1)}
          />
        </div>

        {showHistory && (
          <div style={{ width: "320px", flexShrink: 0 }}>
            <HistoryPanel
              onSelect={handleSelectFromHistory}
              refresh={refreshHistory}
            />
          </div>
        )}
      </div>
    </div>
  )
}