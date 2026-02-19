import { useState, useEffect } from 'react'
import './App.css'

// Import pages
import Login from './pages/Login'
import Register from './pages/Register'
import Contacts from './pages/Contacts'
import Profile from './pages/Profile'

// App.jsx - Main application component
// 
// AUTHENTICATION FLOW:
// 1. Check if token exists in localStorage
// 2. If yes -> show Contacts page (or Profile page)
// 3. If no -> show Login page
// 4. User can switch between Login and Register

function App() {
  // Track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // Track which auth page to show (login or register)
  const [showRegister, setShowRegister] = useState(false)
  
  // Track which page to show when logged in ('contacts' or 'profile')
  const [currentPage, setCurrentPage] = useState('contacts')
  
  // Loading state while checking auth
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Check for existing token when app loads
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
    setCheckingAuth(false)
  }, [])

  // Handle logout - clear token and reset state
  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setCurrentPage('contacts')
  }

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    )
  }

  // If logged in, show contacts or profile page
  if (isLoggedIn) {
    if (currentPage === 'profile') {
      return (
        <Profile 
          onBack={() => setCurrentPage('contacts')}
          onLogout={handleLogout}
        />
      )
    }
    
    return (
      <Contacts 
        onLogout={handleLogout}
        onViewProfile={() => setCurrentPage('profile')}
      />
    )
  }

  // If not logged in, show login or register
  if (showRegister) {
    return (
      <Register
        onRegisterSuccess={() => setShowRegister(false)}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    )
  }

  return (
    <Login
      onLoginSuccess={() => setIsLoggedIn(true)}
      onSwitchToRegister={() => setShowRegister(true)}
    />
  )
}

export default App
