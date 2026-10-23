import { useState, type CSSProperties } from 'react'
import type { ConfirmationResult } from 'firebase/auth'
import { sendOtp, isFirebaseConfigured } from '../lib/firebase'
import { apiFetch, setSession } from '../lib/api'
import { CameraIcon } from './Icons'

type Step = 'mobile' | 'otp'

interface LoginResult {
  registered: boolean
  mobile: string
  kycStatus?: 'pending' | 'approved' | 'rejected'
  isActive?: boolean
}

export default function Login({ onResult }: { onResult: (result: LoginResult) => void }) {
  const [step, setStep] = useState<Step>('mobile')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSendOtp() {
    setError('')
    if (mobile.length !== 10) return setError('Enter a valid 10-digit mobile number.')
    if (!isFirebaseConfigured()) {
      return setError('Firebase is not configured in this build yet (src/lib/firebaseConfig.ts is empty).')
    }
    setLoading(true)
    try {
      const result = await sendOtp(mobile)
      setConfirmation(result)
      setStep('otp')
    } catch (e: any) {
      setError(e?.message || 'Could not send OTP. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp() {
    setError('')
    if (!confirmation || otp.length !== 6) return setError('Enter the 6-digit code.')
    setLoading(true)
    try {
      const cred = await confirmation.confirm(otp)
      const idToken = await cred.user.getIdToken()
      const data = await apiFetch<{
        registered: boolean
        token?: string
        photographer_id?: number
        name?: string
        mobile: string
        kyc_status?: 'pending' | 'approved' | 'rejected'
        is_active?: boolean
      }>('/auth/firebase-login.php', {
        method: 'POST',
        body: { id_token: idToken, purpose: 'photographer_login' },
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
      setError(e?.message || 'Incorrect or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div id="recaptcha-container" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <span style={{ display: 'flex', width: 52, height: 52, alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', borderRadius: 14, color: '#fff' }}>
            <CameraIcon color="#fff" />
          </span>
          <div style={{ fontSize: 19, fontWeight: 500 }}>Instant Photo Partner</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>For registered photographers</div>
        </div>

        {step === 'mobile' ? (
          <>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>Mobile number</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
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
            {error && <div style={{ color: '#c0392b', fontSize: 12, marginBottom: 12 }}>{error}</div>}
            <button
              disabled={mobile.length !== 10 || loading}
              onClick={handleSendOtp}
              style={{ height: 52, background: mobile.length === 10 ? 'var(--accent)' : 'var(--border)', color: mobile.length === 10 ? '#fff' : 'var(--text-muted)', borderRadius: 14, fontSize: 15, fontWeight: 500 }}
            >
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>Enter OTP sent to +91 {mobile}</label>
            <input
              type="tel"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              style={otpStyle}
            />
            {error && <div style={{ color: '#c0392b', fontSize: 12, marginBottom: 12 }}>{error}</div>}
            <button
              disabled={otp.length !== 6 || loading}
              onClick={handleVerifyOtp}
              style={{ height: 52, background: otp.length === 6 ? 'var(--accent)' : 'var(--border)', color: otp.length === 6 ? '#fff' : 'var(--text-muted)', borderRadius: 14, fontSize: 15, fontWeight: 500 }}
            >
              {loading ? 'Verifying…' : 'Verify & continue'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const otpStyle: CSSProperties = {
  width: '100%', textAlign: 'center', letterSpacing: '0.5em', fontSize: 20, background: 'var(--surface)',
  border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', marginBottom: 12, outline: 'none',
}
