import { useState } from 'react'
import { mockActiveBooking, formatCurrency } from '../mock/data'
import { PhoneIcon, NavigateIcon } from './Icons'

const STEPS: { key: typeof mockActiveBooking.status; label: string }[] = [
  { key: 'accepted', label: 'Accepted' },
  { key: 'on_the_way', label: 'On the way' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'completed', label: 'Completed' },
]

const NEXT_ACTION: Record<typeof mockActiveBooking.status, string> = {
  accepted: 'Start trip',
  on_the_way: 'Mark as arrived',
  arrived: 'Mark as completed',
  completed: 'Booking completed',
}

// UI-only pass: each status button posts to POST /bookings/update-status.php.
// "Mark as completed" should hand off to an invoice/photo-delivery step —
// out of scope for this pass.
export default function Active({ onDone }: { onDone: () => void }) {
  const [status, setStatus] = useState<typeof mockActiveBooking.status>(mockActiveBooking.status)
  const booking = mockActiveBooking
  const currentIndex = STEPS.findIndex((s) => s.key === status)

  function advance() {
    const order: (typeof mockActiveBooking.status)[] = ['accepted', 'on_the_way', 'arrived', 'completed']
    const idx = order.indexOf(status)
    if (idx < order.length - 1) {
      setStatus(order[idx + 1])
    } else {
      onDone()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 16px' }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>Booking {booking.id}</span>
        <span style={{ fontSize: 11, fontWeight: 500, background: 'var(--success-bg)', color: 'var(--success)', padding: '4px 10px', borderRadius: 999 }}>
          {STEPS[currentIndex].label}
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 500 }}>
            PD
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{booking.customerName}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{booking.customerPhoneMasked}</div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', color: '#fff', borderRadius: 999, padding: '8px 14px', fontSize: 13, fontWeight: 500 }}>
            <PhoneIcon />
            Call
          </button>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <svg width="100%" height="140" viewBox="0 0 342 140" preserveAspectRatio="none" aria-hidden="true">
            <rect width="342" height="140" fill="#e3e8ee" />
            <path d="M0 50 H342" stroke="#cbd3db" strokeWidth={3} />
            <path d="M150 0 V140" stroke="#cbd3db" strokeWidth={3} />
            <circle cx="200" cy="80" r="7" fill="#4338ca" stroke="#fff" strokeWidth={2} />
          </svg>
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{booking.address}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{booking.distanceKm} km · ~{booking.etaMins} min away</div>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--dark)', color: '#fff', borderRadius: 10, padding: '8px 12px', fontSize: 12, fontWeight: 500 }}>
              <NavigateIcon />
              Navigate
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
          <Row label="Package" value={`${booking.packageName} · ${formatCurrency(booking.value)}`} />
          <Row label="Session time" value={`${booking.durationMins} min`} />
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 14 }}>Status</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((step, i) => (
              <StepDot key={step.key} label={step.label} active={i <= currentIndex} last={i === STEPS.length - 1} connectorActive={i < currentIndex} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 24px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={advance}
          style={{ width: '100%', height: 52, background: 'var(--accent)', color: '#fff', borderRadius: 14, fontSize: 15, fontWeight: 500 }}
        >
          {NEXT_ACTION[status]}
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function StepDot({ label, active, last, connectorActive }: { label: string; active: boolean; last: boolean; connectorActive: boolean }) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: active ? 'var(--accent)' : 'var(--border)' }} />
        <div style={{ fontSize: 10, color: active ? 'var(--text)' : 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>{label}</div>
      </div>
      {!last && <div style={{ flex: 1, height: 2, background: connectorActive ? 'var(--accent)' : 'var(--border)' }} />}
    </>
  )
}
