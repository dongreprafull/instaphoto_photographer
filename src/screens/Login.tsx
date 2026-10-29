import { useState, type CSSProperties } from 'react'
import { apiFetch, setSession } from '../lib/api'
import { CameraIcon } from './Icons'

interface LoginResult {
  registered: boolean
  mobile: string
  kycStatus?: 'pending' | 'approved' | 'rejected'
  isActive?: boolean
}

export default function Login({ onResult }: { onResult: (result: LoginResult) => void }) {
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setError('')
    if (mobile.length !== 10) return setError('Enter a valid 10-digit mobile number.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const data = await apiFetch<{
        registered: boolean
        token?: string
        photographer_id?: number
        name?: string
        mobile: string
        kyc_status?: 'pending' | 'approved' | 'rejected'
        is_active?: boolean
      }>('/auth/login.php', {
        method: 'POST',
        body: { mobile, password, purpose: 'photographer_login' },
        auth: false,
      })

      if (data.registered && data.token) {
        setSession(data.token, {
          photographerId: data.photographer_id!,
          name: data.name || '',
          mobile: data.mobile,
          kycStatus: data.kyc_status!,
          isActive: Boolean(data.is_active),
        })
      }

      onResult({ registered: data.registered, mobile: data.mobile, kycStatus: data.kyc_status, isActive: data.is_active })
    } catch (e: any) {
      setError(e?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <span style={{ display: 'flex', width: 52, height: 52, alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', borderRadius: 14, color: '#fff' }}>
            <CameraIcon color="#fff" />
          </span>
          <div style={{ fontSize: 19, fontWeight: 500 }}>Instant Photo Partner</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>For registered photographers</div>
        </div>

        <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>Mobile number</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
          <span style={{ fontSize: 15, color: 'var(--text-muted)' }}>+91</span>
          <input
            type="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            placeholder="98765 43210"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent' }}
          />
        </div>

        <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          style={passwordStyle}
        />

        {error && <div style={{ color: '#c0392b', fontSize: 12, marginBottom: 12 }}>{error}</div>}

        <button
          disabled={mobile.length !== 10 || password.length < 6 || loading}
          onClick={handleLogin}
          style={{
            height: 52,
            background: mobile.length === 10 && password.length >= 6 ? 'var(--accent)' : 'var(--border)',
            color: mobile.length === 10 && password.length >= 6 ? '#fff' : 'var(--text-muted)',
            borderRadius: 14, fontSize: 15, fontWeight: 500,
          }}
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 14 }}>
          New photographer? Log in with any password for your number — we'll take you to registration.
        </p>
      </div>
    </div>
  )
}

const passwordStyle: CSSProperties = {
  width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
  padding: '14px 16px', fontSize: 15, outline: 'none', marginBottom: 12,
}
