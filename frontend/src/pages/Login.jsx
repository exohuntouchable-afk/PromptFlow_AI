import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#1a1a1a', border: '1px solid #2e2e2e',
        borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px'
      }}>
        <h1 style={{ color: '#6c63ff', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          PromptFlow AI
        </h1>
        <p style={{ color: '#a0a0a0', marginBottom: '2rem' }}>
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </p>

        {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
        {message && <p style={{ color: '#22c55e', marginBottom: '1rem' }}>{message}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%', padding: '0.8rem 1rem', marginBottom: '1rem',
            background: '#252525', border: '1px solid #2e2e2e',
            borderRadius: '8px', color: '#f0f0f0', fontSize: '1rem'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%', padding: '0.8rem 1rem', marginBottom: '1rem',
            background: '#252525',
            border: '1px solid #2e2e2e',
            borderRadius: '8px',
            color: '#f0f0f0', fontSize: '1rem'
          }}
        />
        {error && (
          <p style={{ color: '#ff4444', marginBottom: '1rem' }}>{error}</p>
        )}
        <button
          onClick={handleAuth}
          style={{
            width: '100%',
            padding: '0.8rem',
            background: '#6c63ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
        <p style={{ color: '#888', textAlign: 'center' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: '#6c63ff', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
