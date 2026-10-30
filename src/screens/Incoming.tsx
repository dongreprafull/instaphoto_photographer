import { useEffect, useState } from 'react'
import { apiFetch, ApiError } from '../lib/api'
import { stopRing } from '../lib/ringtone'
import type { PendingOffer } from './Home'

const REQUEST_TIMEOUT_SECONDS = 15

export default function Incoming({
  offer,
  onAccept,
  onDecline,
}: {
  offer: PendingOffer
  onAccept: () => void
  onDecline: () => void
}) {
  const [secondsLeft, setSecondsLeft] = useState(REQUEST_TIMEOUT_SECONDS)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer)
          handleDecline()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      clearInterval(timer)
      stopRing()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAccept() {
    setBusy(true)
    setError('')
    stopRing()
    try {
      await apiFetch('/bookings/accept.php', { method: 'POST', body: { booking_id: offer.booking_id } })
      onAccept()
    } catch (e: any) {
      if (e instanceof ApiError && e.status === 409) {
        setError('This booking was already taken by another photographer.')
        setTimeout(onDecline, 1200)
      } else {
        setError(e?.message || 'Could not accept booking.')
        setBusy(false)
      }
    }
  }

  async function handleDecline() {
    stopRing()
    try {
      await apiFetch('/bookings/decline.php', { method: 'POST', body: { booking_id: offer.booking_id } })
    } catch {
      // ignore
    }
    onDecline()
  }

  const progress = (secondsLeft / REQUEST_TIMEOUT_SECONDS) * 100
  const total = parseFloat(offer.total_amount)

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
            {offer.booking_code.slice(-2)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 500 }}>Booking {offer.booking_code}</div>
          <div style={{ fontSize: 13, color: '#b9b7ad', marginTop: 2 }}>{offer.distance_km} km away</div>
        </div>

        <div style={{ background: 'var(--dark-surface)', borderRadius: 16, padding: '16px 20px', width: 260, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Row label="Package" value={`${offer.package_name} · ${offer.photos_count} photos`} />
          <Row label="Duration" value={`${offer.duration_mins} min`} />
          <Row label="Booking value" value={`₹${total.toFixed(2)}`} />
        </div>

        <div style={{ width: 220 }}>
          <div style={{ height: 6, background: '#3a3933', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--danger)', borderRadius: 999, transition: 'width 1s linear' }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: '#b9b7ad', marginTop: 6 }}>Expires in {secondsLeft}s</div>
        </div>

        {error && <div style={{ color: '#f09595', fontSize: 12 }}>{error}</div>}
      </div>

      <div style={{ padding: '16px 24px 32px', display: 'flex', gap: 12 }}>
        <button onClick={handleDecline} disabled={busy} style={{ flex: 1, height: 56, background: 'transparent', border: '1.5px solid var(--danger)', color: 'var(--danger-text)', borderRadius: 16, fontSize: 15, fontWeight: 500 }}>
          Decline
        </button>
        <button onClick={handleAccept} disabled={busy} style={{ flex: 1, height: 56, background: 'var(--success)', color: '#fff', borderRadius: 16, fontSize: 15, fontWeight: 500, opacity: busy ? 0.7 : 1 }}>
          {busy ? 'Accepting…' : 'Accept'}
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
