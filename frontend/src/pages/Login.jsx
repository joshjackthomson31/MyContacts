import { useState } from 'react'
import { authAPI } from '../services/api'

// Login.jsx - Login page component
//
// This component handles:
// 1. Form for email/password input
// 2. Calling the login API
// 3. Storing the token on success
// 4. Redirecting to contacts page

function Login({ onLoginSuccess, onSwitchToRegister }) {
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Loading state - shows "Logging in..." while API is called
  const [loading, setLoading] = useState(false)
  
  // Error state - shows error messages
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // ASYNC/AWAIT EXPLAINED:
      // API calls take time (network request)
      // 'await' pauses execution until the promise resolves
      // We use try/catch to handle errors
      
      const data = await authAPI.login({ email, password })
      
      // LOCALSTORAGE EXPLAINED:
      // localStorage saves data in the browser that persists
      // Even if you close the browser, it stays
      // We store the auth token here so user stays logged in
      localStorage.setItem('token', data.accessToken)
      
      // Call the function passed from parent to switch to logged-in view
      onLoginSuccess()
      
    } catch (err) {
      // err.response.data.message comes from your backend error handler
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      // finally runs whether success or error
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2>Login</h2>
        
        {/* Show error if there is one */}
        {error && <p style={errorStyle}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          
          <button 
            type="submit" 
            style={buttonStyle}
            disabled={loading}
          >
            {/* Show different text when loading */}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Don't have an account?{' '}
          <button 
            onClick={onSwitchToRegister} 
            style={linkButtonStyle}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  )
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5'
}

const formContainerStyle = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px'
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  margin: '8px 0',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '16px',
  boxSizing: 'border-box'
}

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#4a90d9',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  marginTop: '10px',
  cursor: 'pointer'
}

const linkButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#4a90d9',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: '16px'
}

const errorStyle = {
  color: '#e74c3c',
  backgroundColor: '#fdeaea',
  padding: '10px',
  borderRadius: '4px',
  marginBottom: '10px'
}

export default Login
