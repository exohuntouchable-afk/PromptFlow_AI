import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#0f0f0f',
      color: '#6c63ff',
      fontSize: '1.2rem'
    }}>
      Loading...
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          !session ? <Login /> : <Navigate to="/dashboard" />
        } />
        <Route path="/dashboard" element={
          session ? <Dashboard session={session} /> : <Navigate to="/login" />
        } />
        <Route