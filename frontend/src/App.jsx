import { useState, useEffect } from 'react'
import './App.css'

// Import pages
import Login from './pages/Login'
import Register from './pages/Register'
import Contacts from './pages/Contacts'
import Profile from './pages/Profile'
import Trash from './pages/Trash'

// App.jsx - Main application component
// 
// AUTHENTICATION FLOW:
// 1. Check if token exists in localStorage
// 2. If yes -> show Contacts page (or Profile/Trash page)
// 3. If no -> show Login page
// 4. User can switch between Login and Register
//
// DARK MODE:
// Theme preference is stored in localStorage and applied globally

function App() {
  // Track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // Track which auth page to show (login or register)
  const [showRegister, setShowRegister] = useState(false)
  
  // Track which page to show when logged in ('contacts', 'profile', or 'trash')
  const [currentPage, setCurrentPage] = useState('contacts')
  
  // Loading state while checking auth
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false)

  // Check for existing token and theme preference when app loads
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme === 'true') {
      setDarkMode(true)
    }
    
    setCheckingAuth(false)
  }, [])

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

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

  // If logged in, show contacts, profile, or trash page
  if (isLoggedIn) {
    if (currentPage === 'profile') {
      return (
        <Profile 
          onBack={() => setCurrentPage('contacts')}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )
    }

    if (currentPage === 'trash') {
      return (
        <Trash 
          onBack={() => setCurrentPage('contacts')}
        />
      )
    }
    
    return (
      <Contacts 
        onLogout={handleLogout}
        onViewProfile={() => setCurrentPage('profile')}
        onViewTrash={() => setCurrentPage('trash')}
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
