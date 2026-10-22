import { useEffect, useState } from 'react'
import { mockIncomingRequest, REQUEST_TIMEOUT_SECONDS, formatCurrency } from '../mock/data'

// UI-only pass: this screen is shown full-screen with a ringtone/vibration
// loop (Android high-priority FCM data message + full-screen intent) the
// moment a booking is broadcast to this photographer. Accept calls
// POST /bookings/accept.php — an atomic server-side update ensures only the
// first photographer to accept gets assigned; a late accept shows
// "already assigned" instead of navigating to Active.
export default function Incoming({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  const req = mockIncomingRequest
  const [secondsLeft, setSecondsLeft] = useState(REQUEST_TIMEOUT_SECONDS)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer)
          onDecline()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [onDecline])

  const progress = (secondsLeft / REQUEST_TIMEOUT_SECONDS) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--dark)', color: '#fff' }}>
      <div style={{ textAlign: 'center', padding: '32px 24px 0', fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#b9b7ad' }}>
        New booking request
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="ring-pulse delay" style={{ position: 'absolute', width: 120, height: 120, border: '2px solid var(--danger)', borderRadius: '50%' }} />
          <div className="ring-pulse" style={{ position: 'absolute', width: 120, height: 120, border: '2px solid var(--danger)', borderRadius: '50%' }} />
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--dark-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 500 }}>
            {req.customerInitials}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 500 }}>{req.customerName}</div>
          <div style={{ fontSize: 13, color: '#b9b7ad', marginTop: 2 }}>{req.distanceKm} km away</div>
        </div>

        <div style={{ background: 'var(--dark-surface)', borderRadius: 16, padding: '16px 20px', width: 260, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Row label="Package" value={`${req.packageName} · ${req.photos} photos`} />
          <Row label="Duration" value={`${req.durationMins} min`} />
          <Row label="Booking value" value={`${formatCurrency(req.value)} + GST`} />
        </div>

        <div style={{ width: 220 }}>
          <div style={{ height: 6, background: '#3a3933', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--danger)', borderRadius: 999, transition: 'width 1s linear' }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: '#b9b7ad', marginTop: 6 }}>Expires in {secondsLeft}s</div>
        </div>
      </div>

      <div style={{ padding: '16px 24px 32px', display: 'flex', gap: 12 }}>
        <button
          onClick={onDecline}
          style={{ flex: 1, height: 56, background: 'transparent', border: '1.5px solid var(--danger)', color: 'var(--danger-text)', borderRadius: 16, fontSize: 15, fontWeight: 500 }}
        >
          Decline
        </button>
        <button
          onClick={onAccept}
          style={{ flex: 1, height: 56, background: 'var(--success)', color: '#fff', borderRadius: 16, fontSize: 15, fontWeight: 500 }}
        >
          Accept
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
      <span style={{ color: '#b9b7ad' }}>{label}</span>
      <span>{value}</span>
    </div>
  )
}
