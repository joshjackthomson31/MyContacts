import { useState, useEffect } from 'react'
import { contactsAPI } from '../services/api'

// ContactDetailModal.jsx - Modal to view full contact details
//
// This component fetches fresh data for a specific contact using getOne
// It demonstrates how to fetch a single resource by ID

function ContactDetailModal({ contactId, onClose }) {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch the specific contact when modal opens
  useEffect(() => {
    const fetchContact = async () => {
      try {
        // Using contactsAPI.getOne to fetch a single contact
        const data = await contactsAPI.getOne(contactId)
        setContact(data)
      } catch (err) {
        setError('Failed to load contact details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchContact()
  }, [contactId])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      {/* Stop propagation so clicking inside modal doesn't close it */}
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button onClick={onClose} style={closeButtonStyle}>
          ✕
        </button>

        {loading && (
          <div style={loadingStyle}>
            <p>Loading contact details...</p>
          </div>
        )}

        {error && (
          <div style={errorStyle}>
            <p>{error}</p>
          </div>
        )}

        {contact && !loading && (
          <>
            {/* Contact Avatar */}
            <div style={avatarStyle}>
              {contact.name.charAt(0).toUpperCase()}
            </div>

            {/* Contact Name */}
            <h2 style={nameStyle}>{contact.name}</h2>

            {/* Contact Details */}
            <div style={detailsContainerStyle}>
              <div style={detailRowStyle}>
                <span style={iconStyle}>📧</span>
                <div>
                  <p style={labelStyle}>Email</p>
                  <p style={valueStyle}>{contact.email}</p>
                </div>
              </div>

              <div style={detailRowStyle}>
                <span style={iconStyle}>📱</span>
                <div>
                  <p style={labelStyle}>Phone</p>
                  <p style={valueStyle}>{contact.phone}</p>
                </div>
              </div>

              <div style={detailRowStyle}>
                <span style={iconStyle}>🆔</span>
                <div>
                  <p style={labelStyle}>Contact ID</p>
                  <p style={{ ...valueStyle, fontSize: '12px', color: '#888' }}>
                    {contact._id}
                  </p>
                </div>
              </div>

              {contact.createdAt && (
                <div style={detailRowStyle}>
                  <span style={iconStyle}>📅</span>
                  <div>
                    <p style={labelStyle}>Created</p>
                    <p style={valueStyle}>{formatDate(contact.createdAt)}</p>
                  </div>
                </div>
              )}

              {contact.updatedAt && (
                <div style={detailRowStyle}>
                  <span style={iconStyle}>🔄</span>
                  <div>
                    <p style={labelStyle}>Last Updated</p>
                    <p style={valueStyle}>{formatDate(contact.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={actionsStyle}>
              <button onClick={onClose} style={closeActionButtonStyle}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
}

const modalStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '400px',
  padding: '30px',
  position: 'relative',
  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  maxHeight: '90vh',
  overflow: 'auto'
}

const closeButtonStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: '#888',
  padding: '5px'
}

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: '#4a90d9',
  color: 'white',
  fontSize: '36px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 15px'
}

const nameStyle = {
  textAlign: 'center',
  marginBottom: '25px',
  color: '#333'
}

const detailsContainerStyle = {
  backgroundColor: '#f9f9f9',
  borderRadius: '12px',
  padding: '15px'
}

const detailRowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '12px 0',
  borderBottom: '1px solid #eee'
}

const iconStyle = {
  fontSize: '20px',
  marginRight: '15px',
  marginTop: '2px'
}

const labelStyle = {
  fontSize: '12px',
  color: '#888',
  marginBottom: '2px'
}

const valueStyle = {
  fontSize: '16px',
  color: '#333',
  margin: 0
}

const actionsStyle = {
  marginTop: '25px',
  display: 'flex',
  justifyContent: 'center'
}

const closeActionButtonStyle = {
  padding: '12px 40px',
  backgroundColor: '#4a90d9',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  cursor: 'pointer'
}

const loadingStyle = {
  textAlign: 'center',
  padding: '40px'
}

const errorStyle = {
  textAlign: 'center',
  padding: '40px',
  color: '#e74c3c'
}

export default ContactDetailModal
