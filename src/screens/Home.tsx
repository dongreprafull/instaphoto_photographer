import { useEffect, useRef, useState } from 'react'
import { apiFetch, clearSession, getSession } from '../lib/api'
import { getCurrentLocation } from '../lib/location'
import { SEARCH_RADIUS_KM } from '../mock/data'
import { CameraIcon, EditIcon, WalletIcon, LogoutIcon } from './Icons'

export interface PendingOffer {
  booking_id: number
  distance_km: string
  booking_code: string
  package_price: string
  gst_amount: string
  total_amount: string
  package_name: string
  photos_count: number
  duration_mins: number
}

export default function Home({
  onEditProfile,
  onLogout,
  onIncoming,
  onActiveBooking,
}: {
  onEditProfile: () => void
  onLogout: () => void
  onIncoming: (offer: PendingOffer) => void
  onActiveBooking: () => void
}) {
  const [online, setOnline] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const session = getSession()
  const watchingRef = useRef(false)

  useEffect(() => {
    // On opening the app, check whether there's already an in-progress job.
    apiFetch<{ booking: unknown }>('/photographers/active-booking.php')
      .then((data) => data.booking && onActiveBooking())
      .catch(() => {})
  }, [onActiveBooking])

  useEffect(() => {
    if (!online) return
    watchingRef.current = true

    const pushLocation = async () => {
      try {
        const loc = await getCurrentLocation()
        await apiFetch('/photographers/status.php', {
          method: 'POST',
          body: { is_online: true, lat: loc.lat, lng: loc.lng },
        })
      } catch {
        // keep trying on the next tick
      }
    }
    const checkOffer = async () => {
      try {
        const data = await apiFetch<{ offer: PendingOffer | null }>('/photographers/pending-offer.php')
        if (data.offer && watchingRef.current) onIncoming(data.offer)
      } catch {
        // ignore transient errors
      }
    }

    pushLocation()
    const locationTimer = setInterval(pushLocation, 8000)
    const offerTimer = setInterval(checkOffer, 3000)
    return () => {
      watchingRef.current = false
      clearInterval(locationTimer)
      clearInterval(offerTimer)
    }
  }, [online, onIncoming])

  async function toggleOnline() {
    setError('')
    if (online) {
      setBusy(true)
      try {
        await apiFetch('/photographers/status.php', { method: 'POST', body: { is_online: false } })
        setOnline(false)
      } catch (e: any) {
        setError(e?.message || 'Could not go offline.')
      } finally {
        setBusy(false)
      }
      return
    }
    setBusy(true)
    try {
      const loc = await getCurrentLocation()
      await apiFetch('/photographers/status.php', {
        method: 'POST',
        body: { is_online: true, lat: loc.lat, lng: loc.lng },
      })
      setOnline(true)
    } catch (e: any) {
      setError(e?.message || 'Could not go online. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  function handleLogout() {
    clearSession()
    onLogout()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'flex', width: 28, height: 28, alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', borderRadius: 8, color: '#fff' }}>
            <CameraIcon color="#fff" />
          </span>
          <span style={{ fontSize: 17, fontWeight: 500 }}>Instant Photo Partner</span>
        </div>
        <button onClick={handleLogout} aria-label="Log out" style={{ display: 'flex', width: 32, height: 32, alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <LogoutIcon color="var(--text-muted)" />
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button onClick={onEditProfile} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, textAlign: 'left' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 500 }}>
            {(session?.name || '?').slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{session?.name || 'Your profile'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{session?.mobile ? `+91 ${session.mobile}` : ''}</div>
          </div>
          <EditIcon color="var(--text-muted)" />
        </button>

        <div style={{ background: online ? 'var(--accent)' : 'var(--surface)', border: online ? 'none' : '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: online ? '#fff' : 'var(--text)' }}>
              {online ? "You're online" : "You're offline"}
            </div>
            <div style={{ fontSize: 12, color: online ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', marginTop: 2 }}>
              {online ? `Visible to customers within ${SEARCH_RADIUS_KM} km` : 'Go online to receive booking requests'}
            </div>
          </div>
          <button onClick={toggleOnline} disabled={busy} aria-label="Toggle online status" style={{ width: 52, height: 30, borderRadius: 999, background: online ? 'rgba(255,255,255,0.3)' : 'var(--border)', position: 'relative', flexShrink: 0, opacity: busy ? 0.6 : 1 }}>
            <span style={{ position: 'absolute', top: 3, left: online ? 25 : 3, width: 24, height: 24, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
          </button>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <WalletIcon color="var(--accent)" />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>Earnings</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Earnings summary comes from completed bookings — check the admin panel for now.</div>
        </div>

        {error && <div style={{ color: '#c0392b', fontSize: 13 }}>{error}</div>}
      </div>
    </div>
  )
}
