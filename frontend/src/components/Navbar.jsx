export default function Navbar({ email, onSignOut, onToggleHistory, showHistory }) {
  return (
    <nav style={{
      background: '#1a1a1a',
      borderBottom: '1px solid #2e2e2e',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div style={{
          width: '32px', height: '32px',
          background: '#6c63ff',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '800', fontSize: '1rem', color: '#fff'
        }}>P</div>
        <span style={{ color: '#f0f0f0', fontWeight: '700', fontSize: '1.1rem' }}>
          PromptFlow AI
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleHistory}
          style={{
            padding: '0.5rem 1rem',
            background: showHistory ? '#6c63ff' : '#252525',
            color: '#f0f0f0',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            border: '1px solid #2e2e2e',
            transition: 'background 0.2s'
          }}
        >
          History
        </button>

        <span style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>
          {email}
        </span>

        <button
          onClick={onSignOut}
          style={{
            padding: '0.5rem 1rem',
            background: '#252525',
            color: '#ef4444',
            borderRadius: '8px',
            fontSize: '0.9rem',
            border: '1px solid #2e2e2e',
            transition: 'background 0.2s'
          }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
}
export default Navbar