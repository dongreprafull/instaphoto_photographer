import { useState } from 'react'
import { BackIcon, UploadIcon, CheckIcon } from './Icons'

// UI-only pass: on submit this posts to POST /photographers/register.php
// with profile fields + KYC document uploads (Aadhar, PAN). The account
// stays inactive until an admin approves it from the admin panel — see
// PendingApproval.tsx for the screen shown while waiting.
export default function Register({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [aadharUploaded, setAadharUploaded] = useState(false)
  const [panUploaded, setPanUploaded] = useState(false)

  const canSubmit = name.trim().length > 2 && address.trim().length > 4 && aadharUploaded && panUploaded

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
        <span style={{ fontSize: 16, fontWeight: 500 }}>Photographer registration</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 24px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0' }}>
          <button
            style={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              background: 'var(--accent-bg)',
              border: '2px dashed var(--accent-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: 'var(--accent)',
            }}
          >
            <UploadIcon color="var(--accent)" />
            <span style={{ fontSize: 10, fontWeight: 500 }}>Photo</span>
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Upload profile photo</span>
        </div>

        <Field label="Full name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
          />
        </Field>

        <Field label="Mobile number">
          <input value="+91 98765 43210" disabled style={{ ...inputStyle, color: 'var(--text-muted)' }} />
        </Field>

        <Field label="Address">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your city / service area"
            style={inputStyle}
          />
        </Field>

        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
            KYC documents
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <DocUpload label="Aadhar card" uploaded={aadharUploaded} onUpload={() => setAadharUploaded(true)} />
            <DocUpload label="PAN card" uploaded={panUploaded} onUpload={() => setPanUploaded(true)} />
          </div>
          <p style={{ margin: '10px 2px 0', fontSize: 12, color: 'var(--text-muted)' }}>
            Your documents are reviewed by our team. This usually takes 24–48 hours.
          </p>
        </div>
      </div>

      <div style={{ padding: '16px 24px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <button
          disabled={!canSubmit}
          onClick={onSubmit}
          style={{
            width: '100%',
            height: 52,
            background: canSubmit ? 'var(--accent)' : 'var(--border)',
            color: canSubmit ? '#fff' : 'var(--text-muted)',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          Submit for approval
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

function DocUpload({ label, uploaded, onUpload }: { label: string; uploaded: boolean; onUpload: () => void }) {
  return (
    <button
      onClick={onUpload}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--surface)',
        border: `1px solid ${uploaded ? 'var(--success)' : 'var(--border)'}`,
        borderRadius: 14,
        padding: 14,
        textAlign: 'left',
      }}
    >
      <span
        style={{
          display: 'flex',
          width: 36,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          background: uploaded ? 'var(--success-bg)' : 'var(--accent-bg)',
          color: uploaded ? 'var(--success)' : 'var(--accent)',
          flexShrink: 0,
        }}
      >
        {uploaded ? <CheckIcon color="var(--success)" /> : <UploadIcon color="var(--accent)" />}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{uploaded ? 'Uploaded' : 'Tap to upload a photo or PDF'}</div>
      </div>
    </button>
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
