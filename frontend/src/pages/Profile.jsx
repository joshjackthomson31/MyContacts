import { useState, useEffect } from 'react'
import { authAPI } from '../services/api'

// Profile.jsx - User profile page
// Displays the current user's information

function Profile({ onBack }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getCurrentUser()
        setUser(userData)
      } catch (err) {
        setError('Failed to load user information')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div style={loadingStyle}>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <p style={errorStyle}>{error}</p>
        <button onClick={onBack} style={backButtonStyle}>
          Back to Contacts
        </button>
      </div>
    )
  }

  return (
    <div>
      <header style={headerStyle}>
        <h1>My Profile</h1>
        <button onClick={onBack} style={backButtonStyle}>
          Back to Contacts
        </button>
      </header>

      <main style={mainStyle}>
        <div style={profileCardStyle}>
          {/* User Avatar (placeholder with initials) */}
          <div style={avatarStyle}>
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* User Information */}
          <div style={infoSectionStyle}>
            <h2>{user.username}</h2>
            
            <div style={infoRowStyle}>
              <span style={labelStyle}>Email:</span>
              <span style={valueStyle}>{user.email}</span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>User ID:</span>
              <span style={valueStyle}>{user.id}</span>
            </div>

            <div style={infoRowStyle}>
              <span style={labelStyle}>Account Status:</span>
              <span style={{ ...valueStyle, color: '#27ae60' }}>Active</span>
            </div>
          </div>
        </div>

        {/* Additional info or actions could go here */}
        <div style={actionsStyle}>
          <p style={{ color: '#888', textAlign: 'center' }}>
            More profile features coming soon: Change password, Update email, etc.
          </p>
        </div>
      </main>
    </div>
  )
}

const headerStyle = {
  backgroundColor: '#4a90d9',
  color: 'white',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const backButtonStyle = {
  backgroundColor: 'white',
  color: '#4a90d9',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
}

const mainStyle = {
  padding: '20px',
  maxWidth: '600px',
  margin: '0 auto'
}

const profileCardStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '30px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  textAlign: 'center'
}

const avatarStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  backgroundColor: '#4a90d9',
  color: 'white',
  fontSize: '48px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px'
}

const infoSectionStyle = {
  textAlign: 'left',
  marginTop: '20px'
}

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '15px 0',
  borderBottom: '1px solid #eee'
}

const labelStyle = {
  fontWeight: 'bold',
  color: '#555'
}

const valueStyle = {
  color: '#333'
}

const actionsStyle = {
  marginTop: '30px',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px'
}

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh'
}

const containerStyle = {
  padding: '40px',
  textAlign: 'center'
}

const errorStyle = {
  color: '#e74c3c',
  marginBottom: '20px'
}

export default Profile
