import { useState } from 'react'
import { mockProfile, mockEarnings, formatCurrency, SEARCH_RADIUS_KM } from '../mock/data'
import { CameraIcon, EditIcon, WalletIcon, LogoutIcon } from './Icons'

// UI-only pass: the online toggle posts to POST /photographers/status.php.
// While online, the app should hold a background location watch (every
// 5-10s) and PUT it to the server so booking search can find this
// photographer within SEARCH_RADIUS_KM.
export default function Home({
  onEditProfile,
  onLogout,
  onSimulateIncoming,
}: {
  onEditProfile: () => void
  onLogout: () => void
  onSimulateIncoming: () => void
}) {
  const [online, setOnline] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'flex',
              width: 28,
              height: 28,
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--accent)',
              borderRadius: 8,
              color: '#fff',
            }}
          >
            <CameraIcon color="#fff" />
          </span>
          <span style={{ fontSize: 17, fontWeight: 500 }}>Instant Photo Partner</span>
        </div>
        <button onClick={onLogout} aria-label="Log out" style={{ display: 'flex', width: 32, height: 32, alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <LogoutIcon color="var(--text-muted)" />
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button
          onClick={onEditProfile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 16,
            textAlign: 'left',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'var(--accent-bg)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {mockProfile.initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{mockProfile.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {mockProfile.rating} ★ · {mockProfile.bookingsCount} bookings
            </div>
          </div>
          <EditIcon color="var(--text-muted)" />
        </button>

        <div
          style={{
            background: online ? 'var(--accent)' : 'var(--surface)',
            border: online ? 'none' : '1px solid var(--border)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: online ? '#fff' : 'var(--text)' }}>
              {online ? "You're online" : "You're offline"}
            </div>
            <div style={{ fontSize: 12, color: online ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', marginTop: 2 }}>
              {online ? `Visible to customers within ${SEARCH_RADIUS_KM} km` : 'Go online to receive booking requests'}
            </div>
          </div>
          <button
            onClick={() => setOnline((v) => !v)}
            aria-label="Toggle online status"
            style={{
              width: 52,
              height: 30,
              borderRadius: 999,
              background: online ? 'rgba(255,255,255,0.3)' : 'var(--border)',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 3,
                left: online ? 25 : 3,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <WalletIcon color="var(--accent)" />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>Earnings</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <EarningCard label="Today" value={formatCurrency(mockEarnings.today)} />
            <EarningCard label="This week" value={formatCurrency(mockEarnings.thisWeek)} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
            {mockEarnings.bookingsToday} bookings completed today
          </div>
        </div>

        {online && (
          <button
            onClick={onSimulateIncoming}
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--text-muted)',
              padding: '4px 0',
            }}
          >
            Prototype: simulate an incoming request →
          </button>
        )}
      </div>
    </div>
  )
}

function EarningCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 12, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 500, marginTop: 2 }}>{value}</div>
    </div>
  )
}
