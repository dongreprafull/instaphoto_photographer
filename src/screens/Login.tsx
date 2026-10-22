import { useState } from 'react'
import { CameraIcon } from './Icons'

// UI-only pass: wires up to Firebase Phone Auth once the backend is live —
// POST /auth/otp-request.php sends the OTP, POST /auth/otp-verify.php
// confirms it and returns the session token.
export default function Login({ onVerified }: { onVerified: () => void }) {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <span
            style={{
              display: 'flex',
              width: 52,
              height: 52,
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--accent)',
              borderRadius: 14,
              color: '#fff',
            }}
          >
            <CameraIcon color="#fff" />
          </span>
          <div style={{ fontSize: 19, fontWeight: 500 }}>Instant Photo Partner</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>For registered photographers</div>
        </div>

        {step === 'mobile' ? (
          <>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>
              Mobile number
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 20,
              }}
            >
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
            <button
              disabled={mobile.length !== 10}
              onClick={() => setStep('otp')}
              style={{
                height: 52,
                background: mobile.length === 10 ? 'var(--accent)' : 'var(--border)',
                color: mobile.length === 10 ? '#fff' : 'var(--text-muted)',
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>
              Enter OTP sent to +91 {mobile}
            </label>
            <input
              type="tel"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              style={{
                width: '100%',
                textAlign: 'center',
                letterSpacing: '0.5em',
                fontSize: 20,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 12,
                outline: 'none',
              }}
            />
            <button style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, marginBottom: 20, alignSelf: 'flex-start' }}>
              Resend OTP
            </button>
            <button
              disabled={otp.length !== 6}
              onClick={onVerified}
              style={{
                height: 52,
                background: otp.length === 6 ? 'var(--accent)' : 'var(--border)',
                color: otp.length === 6 ? '#fff' : 'var(--text-muted)',
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Verify &amp; continue
            </button>
          </>
        )}
      </div>
    </div>
  )
}
