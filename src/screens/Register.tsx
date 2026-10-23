import { useRef, useState, type CSSProperties } from 'react'
import { apiUpload, setSession } from '../lib/api'
import { BackIcon, UploadIcon, CheckIcon } from './Icons'

export default function Register({
  mobile,
  onBack,
  onSubmit,
}: {
  mobile: string
  onBack: () => void
  onSubmit: () => void
}) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [aadharDoc, setAadharDoc] = useState<File | null>(null)
  const [panDoc, setPanDoc] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const photoInput = useRef<HTMLInputElement>(null)
  const aadharInput = useRef<HTMLInputElement>(null)
  const panInput = useRef<HTMLInputElement>(null)

  const canSubmit = name.trim().length > 2 && address.trim().length > 4 && aadharDoc && panDoc && !submitting

  async function handleSubmit() {
    if (!canSubmit) return
    setError('')
    setSubmitting(true)
    try {
      const form = new FormData()
      form.append('name', name.trim())
      form.append('mobile', mobile)
      form.append('address', address.trim())
      if (profilePhoto) form.append('profile_photo', profilePhoto)
      if (aadharDoc) form.append('aadhar_doc', aadharDoc)
      if (panDoc) form.append('pan_doc', panDoc)

      const data = await apiUpload<{ photographer_id: number; token: string; kyc_status: 'pending' }>(
        '/photographers/register.php',
        form
      )
      setSession(data.token, {
        photographerId: data.photographer_id,
        name: name.trim(),
        mobile,
        kycStatus: data.kyc_status,
        isActive: false,
      })
      onSubmit()
    } catch (e: any) {
      setError(e?.message || 'Could not submit registration.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '24px 24px 16px' }}>
        <button onClick={onBack} aria-label="Back" style={{ display: 'flex', width: 32, height: 32, alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <BackIcon />
        </button>
        <span style={{ fontSize: 16, fontWeight: 500 }}>Photographer registration</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 24px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0' }}>
          <input ref={photoInput} type="file" accept="image/*" hidden onChange={(e) => setProfilePhoto(e.target.files?.[0] ?? null)} />
          <button
            onClick={() => photoInput.current?.click()}
            style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--accent-bg)', border: `2px dashed ${profilePhoto ? 'var(--success)' : 'var(--accent-border)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--accent)' }}
          >
            {profilePhoto ? <CheckIcon color="var(--success)" /> : <UploadIcon color="var(--accent)" />}
            <span style={{ fontSize: 10, fontWeight: 500 }}>Photo</span>
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{profilePhoto ? profilePhoto.name : 'Upload profile photo (optional)'}</span>
        </div>

        <Field label="Full name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
        </Field>

        <Field label="Mobile number">
          <input value={`+91 ${mobile}`} disabled style={{ ...inputStyle, color: 'var(--text-muted)' }} />
        </Field>

        <Field label="Address">
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your city / service area" style={inputStyle} />
        </Field>

        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>KYC documents</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input ref={aadharInput} type="file" accept="image/*,.pdf" hidden onChange={(e) => setAadharDoc(e.target.files?.[0] ?? null)} />
            <DocUpload label="Aadhar card" file={aadharDoc} onClick={() => aadharInput.current?.click()} />
            <input ref={panInput} type="file" accept="image/*,.pdf" hidden onChange={(e) => setPanDoc(e.target.files?.[0] ?? null)} />
            <DocUpload label="PAN card" file={panDoc} onClick={() => panInput.current?.click()} />
          </div>
          <p style={{ margin: '10px 2px 0', fontSize: 12, color: 'var(--text-muted)' }}>Your documents are reviewed by our team. This usually takes 24–48 hours.</p>
        </div>

        {error && <div style={{ color: '#c0392b', fontSize: 13 }}>{error}</div>}
      </div>

      <div style={{ padding: '16px 24px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          style={{ width: '100%', height: 52, background: canSubmit ? 'var(--accent)' : 'var(--border)', color: canSubmit ? '#fff' : 'var(--text-muted)', borderRadius: 14, fontSize: 15, fontWeight: 500 }}
        >
          {submitting ? 'Submitting…' : 'Submit for approval'}
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

function DocUpload({ label, file, onClick }: { label: string; file: File | null; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)', border: `1px solid ${file ? 'var(--success)' : 'var(--border)'}`, borderRadius: 14, padding: 14, textAlign: 'left' }}>
      <span style={{ display: 'flex', width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: file ? 'var(--success-bg)' : 'var(--accent-bg)', color: file ? 'var(--success)' : 'var(--accent)', flexShrink: 0 }}>
        {file ? <CheckIcon color="var(--success)" /> : <UploadIcon color="var(--accent)" />}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{file ? file.name : 'Tap to upload a photo or PDF'}</div>
      </div>
    </button>
  )
}

const inputStyle: CSSProperties = {
  width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
  padding: '14px 16px', fontSize: 15, outline: 'none',
}
