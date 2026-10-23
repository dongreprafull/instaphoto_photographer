import { useState } from 'react'
import Login from './screens/Login'
import Register from './screens/Register'
import PendingApproval from './screens/PendingApproval'
import Home, { type PendingOffer } from './screens/Home'
import EditProfile from './screens/EditProfile'
import Incoming from './screens/Incoming'
import Active from './screens/Active'
import { getSession } from './lib/api'

type Screen = 'login' | 'register' | 'pending' | 'home' | 'editProfile' | 'incoming' | 'active'

export default function App() {
  const existing = getSession()
  const [screen, setScreen] = useState<Screen>(
    existing ? (existing.kycStatus === 'approved' && existing.isActive ? 'home' : 'pending') : 'login'
  )
  const [pendingMobile, setPendingMobile] = useState('')
  const [incomingOffer, setIncomingOffer] = useState<PendingOffer | null>(null)

  return (
    <div className="phone-frame">
      {screen === 'login' && (
        <Login
          onResult={(result) => {
            if (!result.registered) {
              setPendingMobile(result.mobile)
              setScreen('register')
            } else if (result.kycStatus === 'approved' && result.isActive) {
              setScreen('home')
            } else {
              setScreen('pending')
            }
          }}
        />
      )}
      {screen === 'register' && (
        <Register mobile={pendingMobile} onBack={() => setScreen('login')} onSubmit={() => setScreen('pending')} />
      )}
      {screen === 'pending' && <PendingApproval onLogout={() => setScreen('login')} onApproved={() => setScreen('home')} />}
      {screen === 'home' && (
        <Home
          onEditProfile={() => setScreen('editProfile')}
          onLogout={() => setScreen('login')}
          onIncoming={(offer) => {
            setIncomingOffer(offer)
            setScreen('incoming')
          }}
          onActiveBooking={() => setScreen('active')}
        />
      )}
      {screen === 'editProfile' && <EditProfile onBack={() => setScreen('home')} />}
      {screen === 'incoming' && incomingOffer && (
        <Incoming offer={incomingOffer} onAccept={() => setScreen('active')} onDecline={() => setScreen('home')} />
      )}
      {screen === 'active' && <Active onDone={() => setScreen('home')} />}
    </div>
  )
}
