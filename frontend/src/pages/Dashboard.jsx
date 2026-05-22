import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import PromptBuilder from '../components/PromptBuilder'
import HistoryPanel from '../components/HistoryPanel'

export default function Dashboard({ session }) {
  const [showHistory, setShowHistory] = useState(false)
  const [refreshHistory, setRefreshHistory] = useState(0)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>
      <Navbar
        email={session.user.email}
        onSignOut={handleSignOut}
        onToggleHistory={() => setShowHistory(!showHistory)}
        showHistory={showHistory}
      />

      <div style={{
        display: 'flex',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem