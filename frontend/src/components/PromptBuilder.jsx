import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function PromptBuilder({ userId, onPromptSaved }) {
  const [agentPurpose, setAgentPurpose] = useState('')
  const [agentTone, setAgentTone] = useState('professional')
  const [agentPlatform, setAgentPlatform] = useState('general')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!agentPurpose.trim()) {
      setError('Please describe what your AI agent should do.')
      return
    }
    setLoading(true)
    setError('')
    setGeneratedPrompt('')

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentPurpose, agentTone, agentPlatform, userId })
        }
      )
      const data = await response.json()
      if (data.error) { setError(data.error); return }
      setGeneratedPrompt(data.prompt)

      await supabase.from('prompt_history').insert({
        user_id: userId,
        agent_purpose: agentPurpose,
        generated_prompt: data.prompt
      })
      onPromptSaved()
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: '#252525', border: '1px solid #2e2e2e',
    borderRadius: '8px', color: '#f0f0f0',
    fontSize: '1rem', marginBottom: '1rem'
  }

  return (
    <div>
      <div style={{
        background: '#1a1a1a', border: '1px solid #2e2e2e',
        borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem'
      }}>
        <h2 style={{ color: '#f0f0f0', marginBottom: '0.5rem' }}>
          Build Your Prompt
        </h2>
        <p style={{ color: '#a0a0a0', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Describe your AI agent and we'll generate the perfect prompt for it.
        </p>

        {error && (
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
        )}

        <label style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>
          What should your AI agent do?
        </label>
        <textarea
          placeholder="e.g. I want an AI agent that helps me reply to customer support emails in a friendly way..."
          value={agentPurpose}
          onChange={e => setAgentPurpose(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', marginTop: '0.4rem' }}
        />

        <label style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>Tone</label>
        <select
          value={agentTone}
          onChange={e => setAgentTone(e.target.value)}
          style={{ ...inputStyle, marginTop: '0.4rem' }}
        >
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="creative">Creative</option>
        </select>

        <label style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>Platform</label>
        <select
          value={agentPlatform}
          onChange={e => setAgentPlatform(e.target.value)}
          style={{ ...inputStyle, marginTop: '0.4rem' }}
        >
          <option value="general">General</option>
          <option value="chatgpt">ChatGPT</option>
          <option value="claude">Claude</option>
          <option value="gemini">Gemini</option>
          <option value="custom">Custom AI</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            width: '100%', padding: '0.9rem',
            background: loading ? '#3d3d3d' : '#6c63ff',
            color: '#fff', borderRadius: '8px',
            fontSize: '1rem', fontWeight: '600',
            transition: 'background 0.2s'
          }}
        >
          {loading ? 'Generating...' : '✨ Generate Prompt'}
        </button>
      </div>

      {generatedPrompt && (
        <div style={{
          background: '#1a1a1a', border: '1px solid #6c63ff',
          borderRadius: '16px', padding: '2rem'
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '1rem'
          }}>
            <h3 style={{ color: '#f0f0f0' }}>Your Generated Prompt</h3>
            <button
              onClick={handleCopy}
              style={{
                padding: '0.5rem 1.2rem',
                background: copied ? '#22c55e' : '#252525',
                color: '#f0f0f0', borderRadius: '8px',
                border: '1px solid #2e2e2e', fontSize: '0.9rem',
                transition: 'background 0.2s'
              }}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <p style={{
            color: '#f0f0f0', lineHeight: '1.7',
            whiteSpace: 'pre-wrap', fontSize: '0.95rem'
          }}>
            {generatedPrompt}
          </p>
        </div>
      )}
    </div>
  )
}