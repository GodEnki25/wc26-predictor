import { useState } from 'react'
import { signup, login } from '../services/api'

interface Props {
  onSuccess: (token: string, user: { id: string; email: string; name: string }) => void
  onClose: () => void
}

const C = {
  bg: '#0e0416',
  card: '#1a0820',
  cardHeader: '#130320',
  border: 'rgba(107,33,168,0.35)',
  lime: '#c8f000',
  red: '#c8102e',
  purple: '#6b21a8',
  white88: 'rgba(255,255,255,0.88)',
  white50: 'rgba(255,255,255,0.50)',
  white20: 'rgba(255,255,255,0.20)',
}

export default function AuthModal({ onSuccess, onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (mode === 'signup' && !name) {
      setError('Please enter your name')
      return
    }

    setLoading(true)
    try {
      const data = mode === 'signup'
        ? await signup(email, password, name)
        : await login(email, password)

      localStorage.setItem('wc26_token', data.token)
      localStorage.setItem('wc26_user', JSON.stringify(data.user))
      onSuccess(data.token, data.user)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    background: '#0e0416',
    border: `1px solid rgba(107,33,168,0.4)`,
    borderRadius: 8,
    padding: '11px 14px',
    color: C.white88,
    fontSize: 13,
    outline: 'none',
    fontFamily: 'sans-serif',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }} onClick={onClose}>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          width: '100%', maxWidth: 420,
          overflow: 'hidden',
          animation: 'slideUp 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{
          background: C.cardHeader,
          borderBottom: `1px solid ${C.border}`,
          padding: '16px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>
              {mode === 'signup' ? '🏆 Create Account' : '👋 Welcome Back'}
            </div>
            <div style={{ fontSize: 11, color: C.white20, marginTop: 2 }}>
              {mode === 'signup' ? 'Save your predictions forever' : 'Login to access your picks'}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: C.white50, fontSize: 20, cursor: 'pointer',
          }}>✕</button>
        </div>

        {/* Form */}
        <div style={{ padding: '24px' }}>

          {/* Toggle */}
          <div style={{
            display: 'flex', gap: 4,
            background: '#0e0416', borderRadius: 8, padding: 4,
            marginBottom: 20,
          }}>
            {(['signup', 'login'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '8px', borderRadius: 6, border: 'none',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                background: mode === m
                  ? `linear-gradient(135deg, ${C.red}, ${C.purple})`
                  : 'transparent',
                color: mode === m ? '#fff' : C.white50,
              }}>
                {m === 'signup' ? 'Sign Up' : 'Login'}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: 11, color: C.white50, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: 11, color: C.white50, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, color: C.white50, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 12,
              padding: '10px 14px',
              background: 'rgba(200,16,46,0.1)',
              border: '1px solid rgba(200,16,46,0.3)',
              borderRadius: 8,
              fontSize: 12, color: '#fc8181',
            }}>{error}</div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', marginTop: 20,
              padding: '13px', borderRadius: 8, border: 'none',
              fontSize: 14, fontWeight: 900,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading
                ? 'rgba(255,255,255,0.07)'
                : `linear-gradient(135deg, ${C.red}, ${C.purple})`,
              color: loading ? C.white20 : '#fff',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(200,16,46,0.3)',
            }}
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account →' : 'Login →'}
          </button>

        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}