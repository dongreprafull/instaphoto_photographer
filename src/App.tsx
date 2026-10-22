import { useState } from 'react'
import Login from './screens/Login'
import Register from './screens/Register'
import PendingApproval from './screens/PendingApproval'
import Home from './screens/Home'
import EditProfile from './screens/EditProfile'
import Incoming from './screens/Incoming'
import Active from './screens/Active'

type Screen = 'login' | 'register' | 'pending' | 'home' | 'editProfile' | 'incoming' | 'active'

export default function App() {
  // Starts past login/registration/approval — mockProfile.kycStatus is
  // 'approved', matching a photographer who has already been onboarded.
  // Set to 'login' to preview the OTP → registration → pending flow.
  const [screen, setScreen] = useState<Screen>('home')

  return (
    <div className="phone-frame">
      {screen === 'login' && <Login onVerified={() => setScreen('register')} />}
      {screen === 'register' && <Register onBack={() => setScreen('login')} onSubmit={() => setScreen('pending')} />}
      {screen === 'pending' && <PendingApproval onLogout={() => setScreen('login')} />}
      {screen === 'home' && (
        <Home
          onEditProfile={() => setScreen('editProfile')}
          onLogout={() => setScreen('login')}
          onSimulateIncoming={() => setScreen('incoming')}
        />
      )}
      {screen === 'editProfile' && <EditProfile onBack={() => setScreen('home')} />}
      {screen === 'incoming' && <Incoming onAccept={() => setScreen('active')} onDecline={() => setScreen('home')} />}
      {screen === 'active' && <Active onDone={() => setScreen('home')} />}
    </div>
  )
}
