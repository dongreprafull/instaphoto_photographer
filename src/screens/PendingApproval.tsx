import { ClockIcon, LogoutIcon } from './Icons'

// UI-only pass: shown while the admin reviews the submitted KYC. Once wired
// up, this polls GET /photographers/me.php (or a push notification) and
// auto-navigates to Home the moment kycStatus flips to 'approved'.
export default function PendingApproval({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '24px 32px' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--warning-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ClockIcon color="var(--warning)" />
        </div>
        <div style={{ fontSize: 19, fontWeight: 500, textAlign: 'center' }}>Your application is under review</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
          Our team is verifying your profile and KYC documents. You'll be notified once approved — usually within 24–48 hours.
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, width: '100%', marginTop: 8 }}>
          <StatusRow label="Profile details" status="done" />
          <StatusRow label="Aadhar card" status="done" />
          <StatusRow label="PAN card" status="done" />
          <StatusRow label="Admin approval" status="pending" last />
        </div>
      </div>

      <div style={{ padding: '16px 24px 24px' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 48,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--text-muted)',
          }}
        >
          <LogoutIcon />
          Log out
        </button>
      </div>
    </div>
  )
}

function StatusRow({ label, status, last }: { label: string; status: 'done' | 'pending'; last?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 0',
        borderBottom: last ? 'none' : '1px solid var(--border)',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: status === 'done' ? 'var(--success)' : 'var(--warning)',
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 13, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 500, color: status === 'done' ? 'var(--success)' : 'var(--warning)' }}>
        {status === 'done' ? 'Verified' : 'Pending'}
      </span>
    </div>
  )
}
