import { useState } from 'react'
import { mockProfile } from '../mock/data'
import { BackIcon, CameraIcon } from './Icons'

// UI-only pass: save posts to POST /photographers/update-profile.php.
export default function EditProfile({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState(mockProfile.name)
  const [address, setAddress] = useState(mockProfile.address)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '24px 24px 16px' }}>
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            display: 'flex',
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
          }}
        >
          <BackIcon />
        </button>
        <span style={{ fontSize: 16, fontWeight: 500 }}>Edit profile</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 24px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0' }}>
          <button
            style={{
              position: 'relative',
              width: 84,
              height: 84,
              borderRadius: '50%',
              background: 'var(--accent-bg)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 500,
            }}
          >
            {mockProfile.initials}
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--accent)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg)',
              }}
            >
              <CameraIcon color="#fff" />
            </span>
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tap to change photo</span>
        </div>

        <Field label="Full name">
          <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </Field>

        <Field label="Mobile number">
          <input value={mockProfile.mobile} disabled style={{ ...inputStyle, color: 'var(--text-muted)' }} />
        </Field>

        <Field label="Address / service area">
          <input value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
        </Field>

        <div style={{ background: 'var(--success-bg)', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'var(--success)' }}>KYC verified — Aadhar &amp; PAN approved</span>
        </div>
      </div>

      <div style={{ padding: '16px 24px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onBack}
          style={{
            width: '100%',
            height: 52,
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          Save changes
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: '14px 16px',
  fontSize: 15,
  outline: 'none',
}
