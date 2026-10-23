import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { PhoneIcon, NavigateIcon } from './Icons'

type Status = 'assigned' | 'on_the_way' | 'arrived' | 'completed'

interface ActiveBookingDetail {
  booking_id: number
  booking_code: string
  status: Status
  total_amount: string
  address: string | null
  package_name: string
  photos_count: number
  duration_mins: number
  customer_name: string
  customer_mobile: string
}

const STEPS: { key: Status; label: string }[] = [
  { key: 'assigned', label: 'Assigned' },
  { key: 'on_the_way', label: 'On the way' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'completed', label: 'Completed' },
]

const NEXT_STATUS: Record<Status, Status | null> = {
  assigned: 'on_the_way',
  on_the_way: 'arrived',
  arrived: 'completed',
  completed: null,
}

const NEXT_LABEL: Record<Status, string> = {
  assigned: 'Start trip',
  on_the_way: 'Mark as arrived',
  arrived: 'Mark as completed',
  completed: 'Booking completed',
}

export default function Active({ initialBookingId, onDone }: { initialBookingId?: number; onDone: () => void }) {
  const [booking, setBooking] = useState<ActiveBookingDetail | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch<{ booking: ActiveBookingDetail | null }>('/photographers/active-booking.php')
      .then((data) => {
        if (data.booking) setBooking(data.booking)
        else onDone()
      })
      .catch(() => setError('Could not load booking.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBookingId])

  async function advance() {
    if (!booking) return
    const next = NEXT_STATUS[booking.status]
    if (!next) return onDone()
    setBusy(true)
    setError('')
    try {
      await apiFetch('/bookings/update-status.php', { method: 'POST', body: { booking_id: booking.booking_id, status: next } })
      if (next === 'completed') {
        onDone()
      } else {
        setBooking({ ...booking, status: next })
      }
    } catch (e: any) {
      setError(e?.message || 'Could not update status.')
    } finally {
      setBusy(false)
    }
  }

  if (!booking) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        {error || 'Loading…'}
      </div>
    )
  }

  const currentIndex = STEPS.findIndex((s) => s.key === booking.status)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 16px' }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>Booking {booking.booking_code}</span>
        <span style={{ fontSize: 11, fontWeight: 500, background: 'var(--success-bg)', color: 'var(--success)', padding: '4px 10px', borderRadius: 999 }}>
          {STEPS[currentIndex]?.label}
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 500 }}>
            {booking.customer_name.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{booking.customer_name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{booking.customer_mobile}</div>
          </div>
          <a href={`tel:${booking.customer_mobile}`} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', color: '#fff', borderRadius: 999, padding: '8px 14px', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            <PhoneIcon />
            Call
          </a>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{booking.address || 'Address not provided'}</div>
            </div>
            {booking.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(booking.address)}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--dark)', color: '#fff', borderRadius: 10, padding: '8px 12px', fontSize: 12, fontWeight: 500, textDecoration: 'none' }}
              >
                <NavigateIcon />
                Navigate
              </a>
            )}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
          <Row label="Package" value={`${booking.package_name} · ₹${parseFloat(booking.total_amount).toFixed(2)}`} />
          <Row label="Session time" value={`${booking.duration_mins} min`} />
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 14 }}>Status</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((step, i) => (
              <StepDot key={step.key} label={step.label} active={i <= currentIndex} last={i === STEPS.length - 1} connectorActive={i < currentIndex} />
            ))}
          </div>
        </div>

        {error && <div style={{ color: '#c0392b', fontSize: 13 }}>{error}</div>}
      </div>

      <div style={{ padding: '16px 24px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <button onClick={advance} disabled={busy} style={{ width: '100%', height: 52, background: 'var(--accent)', color: '#fff', borderRadius: 14, fontSize: 15, fontWeight: 500, opacity: busy ? 0.7 : 1 }}>
          {busy ? 'Updating…' : NEXT_LABEL[booking.status]}
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
