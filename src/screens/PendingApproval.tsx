import { useEffect, useState } from 'react'
import { apiFetch, updateSession } from '../lib/api'
import { ClockIcon, LogoutIcon } from './Icons'

export default function PendingApproval({ onLogout, onApproved }: { onLogout: () => void; onApproved: () => void }) {
  const [rejected, setRejected] = useState(false)

  useEffect(() => {
    let active = true
    const poll = () =>
      apiFetch<{ photographer: { kyc_status: 'pending' | 'approved' | 'rejected'; is_active: boolean } }>('/photographers/me.php')
        .then((data) => {
          if (!active) return
          updateSession({ kycStatus: data.photographer.kyc_status, isActive: data.photographer.is_active })
          if (data.photographer.kyc_status === 'approved' && data.photographer.is_active) onApproved()
          if (data.photographer.kyc_status === 'rejected') setRejected(true)
        })
        .catch(() => {})
    poll()
    const interval = setInterval(poll, 8000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [onApproved])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '24px 32px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ClockIcon color="var(--warning)" />
        </div>
        <div style={{ fontSize: 19, fontWeight: 500, textAlign: 'center' }}>
          {rejected ? 'Your application was not approved' : 'Your application is under review'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
          {rejected
            ? 'Contact support if you think this is a mistake.'
            : "Our team is verifying your profile and KYC documents. You'll be notified once approved — usually within 24–48 hours."}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, width: '100%', marginTop: 8 }}>
          <StatusRow label="Profile details" status="done" />
          <StatusRow label="Aadhar card" status="done" />
          <StatusRow label="PAN card" status="done" />
          <StatusRow label="Admin approval" status={rejected ? 'rejected' : 'pending'} last />
        </div>
      </div>

      <div style={{ padding: '16px 24px 24px' }}>
        <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>
          <LogoutIcon />
          Log out
        </button>
      </div>
    </div>
  )
}

function StatusRow({ label, status, last }: { label: string; status: 'done' | 'pending' | 'rejected'; last?: boolean }) {
  const color = status === 'done' ? 'var(--success)' : status === 'rejected' ? 'var(--danger)' : 'var(--warning)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 13, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 500, color }}>
        {status === 'done' ? 'Verified' : status === 'rejected' ? 'Rejected' : 'Pending'}
      </span>
    </div>
  )
}
