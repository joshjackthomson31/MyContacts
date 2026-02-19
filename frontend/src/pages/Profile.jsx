import { useState, useEffect } from 'react'
import { authAPI } from '../services/api'

// Profile.jsx - User profile page
// Displays the current user's information and allows updating email/password

function Profile({ onBack, onTokenUpdate }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Email update form state
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  // Password change form state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

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

  // Handle email update
  const handleEmailUpdate = async (e) => {
    e.preventDefault()
    setEmailError('')
    setEmailMessage('')
    setEmailLoading(true)

    try {
      const result = await authAPI.updateEmail(newEmail, emailPassword)
      
      // Update token in localStorage (new token has updated email)
      if (result.accessToken) {
        localStorage.setItem('token', result.accessToken)
      }
      
      // Update local user state
      setUser({ ...user, email: result.email })
      setEmailMessage('Email updated successfully!')
      setNewEmail('')
      setEmailPassword('')
      setShowEmailForm(false)
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Failed to update email')
    } finally {
      setEmailLoading(false)
    }
  }

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordMessage('')

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    setPasswordLoading(true)

    try {
      await authAPI.changePassword(currentPassword, newPassword)
      setPasswordMessage('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

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
          {/* Success messages */}
          {emailMessage && <p style={successStyle}>{emailMessage}</p>}
          {passwordMessage && <p style={successStyle}>{passwordMessage}</p>}

          {/* Action buttons */}
          <div style={buttonGroupStyle}>
            <button 
              onClick={() => { setShowEmailForm(!showEmailForm); setShowPasswordForm(false); }}
              style={actionButtonStyle}
            >
              {showEmailForm ? 'Cancel' : 'Update Email'}
            </button>
            <button 
              onClick={() => { setShowPasswordForm(!showPasswordForm); setShowEmailForm(false); }}
              style={actionButtonStyle}
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {/* Update Email Form */}
          {showEmailForm && (
            <form onSubmit={handleEmailUpdate} style={formStyle}>
              <h3 style={formTitleStyle}>Update Email</h3>
              {emailError && <p style={formErrorStyle}>{emailError}</p>}
              <input
                type="email"
                placeholder="New Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="password"
                placeholder="Current Password (to confirm)"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" style={submitButtonStyle} disabled={emailLoading}>
                {emailLoading ? 'Updating...' : 'Update Email'}
              </button>
            </form>
          )}

          {/* Change Password Form */}
          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} style={formStyle}>
              <h3 style={formTitleStyle}>Change Password</h3>
              {passwordError && <p style={formErrorStyle}>{passwordError}</p>}
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="password"
                placeholder="New Password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" style={submitButtonStyle} disabled={passwordLoading}>
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
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

const buttonGroupStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'center',
  marginBottom: '20px'
}

const actionButtonStyle = {
  backgroundColor: '#4a90d9',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
}

const formStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  marginTop: '15px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}

const formTitleStyle = {
  marginBottom: '15px',
  color: '#333'
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box'
}

const submitButtonStyle = {
  width: '100%',
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px'
}

const formErrorStyle = {
  color: '#e74c3c',
  marginBottom: '10px',
  fontSize: '14px'
}

const successStyle = {
  color: '#27ae60',
  textAlign: 'center',
  marginBottom: '15px',
  fontWeight: 'bold'
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
