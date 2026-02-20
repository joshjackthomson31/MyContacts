import { useState, useEffect } from 'react'
import { contactsAPI } from '../services/api'

// Trash.jsx - View and manage deleted contacts
// Contacts moved to trash can be restored or permanently deleted

function Trash({ onBack }) {
  const [trashedContacts, setTrashedContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch trashed contacts on mount
  useEffect(() => {
    const fetchTrash = async () => {
      try {
        const data = await contactsAPI.getTrash()
        setTrashedContacts(data)
      } catch (err) {
        setError('Failed to load trash')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrash()
  }, [])

  // Restore a contact from trash
  const handleRestore = async (id) => {
    try {
      await contactsAPI.restore(id)
      // Remove from trash list
      setTrashedContacts(trashedContacts.filter(c => c._id !== id))
    } catch (err) {
      alert('Failed to restore contact')
    }
  }

  // Permanently delete a contact
  const handlePermanentDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this contact? This action cannot be undone.')) {
      return
    }
    
    try {
      await contactsAPI.permanentDelete(id)
      // Remove from trash list
      setTrashedContacts(trashedContacts.filter(c => c._id !== id))
    } catch (err) {
      alert('Failed to delete contact')
    }
  }

  // Empty all trash
  const handleEmptyTrash = async () => {
    if (!confirm('Are you sure you want to permanently delete ALL contacts in trash? This action cannot be undone.')) {
      return
    }

    try {
      // Delete all trashed contacts
      await Promise.all(trashedContacts.map(c => contactsAPI.permanentDelete(c._id)))
      setTrashedContacts([])
    } catch (err) {
      alert('Failed to empty trash')
    }
  }

  if (loading) {
    return (
      <div style={loadingStyle}>
        <p>Loading trash...</p>
      </div>
    )
  }

  return (
    <div>
      <header style={headerStyle}>
        <h1>Trash</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {trashedContacts.length > 0 && (
            <button onClick={handleEmptyTrash} style={emptyTrashButtonStyle}>
              Empty Trash
            </button>
          )}
          <button onClick={onBack} style={backButtonStyle}>
            Back to Contacts
          </button>
        </div>
      </header>

      <main style={mainStyle}>
        {error && <p style={errorStyle}>{error}</p>}

        <p style={infoTextStyle}>
          Deleted contacts are kept here for recovery. You can restore them or delete them permanently.
        </p>

        {trashedContacts.length === 0 ? (
          <p style={emptyStyle}>Trash is empty</p>
        ) : (
          <>
            <h2>Deleted Contacts ({trashedContacts.length})</h2>
            {trashedContacts.map(contact => (
              <div key={contact._id} style={trashCardStyle}>
                <div style={contactInfoStyle}>
                  <h3 style={{ margin: 0 }}>{contact.name}</h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>{contact.email}</p>
                  <p style={{ margin: '5px 0', color: '#666' }}>{contact.phone}</p>
                  <p style={deletedAtStyle}>
                    Deleted: {new Date(contact.deletedAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={buttonContainerStyle}>
                  <button 
                    onClick={() => handleRestore(contact._id)} 
                    style={restoreButtonStyle}
                  >
                    Restore
                  </button>
                  <button 
                    onClick={() => handlePermanentDelete(contact._id)} 
                    style={deleteButtonStyle}
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  )
}

const headerStyle = {
  backgroundColor: '#e74c3c',
  color: 'white',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const backButtonStyle = {
  backgroundColor: 'white',
  color: '#e74c3c',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
}

const emptyTrashButtonStyle = {
  backgroundColor: 'transparent',
  color: 'white',
  border: '2px solid white',
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

const infoTextStyle = {
  backgroundColor: '#fef5e7',
  padding: '15px',
  borderRadius: '8px',
  color: '#9a7d0a',
  marginBottom: '20px'
}

const trashCardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '15px',
  margin: '10px 0',
  backgroundColor: '#f9f9f9',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const contactInfoStyle = {
  flex: 1
}

const deletedAtStyle = {
  margin: '5px 0',
  fontSize: '12px',
  color: '#999'
}

const buttonContainerStyle = {
  display: 'flex',
  gap: '10px',
  flexDirection: 'column'
}

const restoreButtonStyle = {
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer'
}

const deleteButtonStyle = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer'
}

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh'
}

const errorStyle = {
  color: '#e74c3c',
  backgroundColor: '#fdeaea',
  padding: '10px',
  borderRadius: '4px',
  marginBottom: '10px'
}

const emptyStyle = {
  textAlign: 'center',
  color: '#888',
  padding: '40px'
}

export default Trash
