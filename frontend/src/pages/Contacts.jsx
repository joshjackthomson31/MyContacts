import { useState, useEffect } from 'react'
import { contactsAPI, authAPI } from '../services/api'
import ContactCard from '../components/ContactCard'
import ContactForm from '../components/ContactForm'
import EditContactModal from '../components/EditContactModal'
import ContactDetailModal from '../components/ContactDetailModal'

// Contacts.jsx - Main contacts page (after login)
//
// useEffect EXPLAINED:
// useEffect runs code AFTER the component renders
// It's used for "side effects" like:
// - Fetching data from an API
// - Setting up subscriptions
// - Changing the document title
//
// Syntax: useEffect(functionToRun, [dependencies])
// - If dependencies = [], runs ONCE when component mounts
// - If dependencies = [someValue], runs when someValue changes

function Contacts({ onLogout, onViewProfile }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // State for current user info
  const [user, setUser] = useState(null)
  
  // State for editing - which contact is being edited (null = none)
  const [editingContact, setEditingContact] = useState(null)
  
  // State for viewing - which contact ID is being viewed (null = none)
  const [viewingContactId, setViewingContactId] = useState(null)

  // useEffect to load contacts and user info when page opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contacts and user info in parallel
        const [contactsData, userData] = await Promise.all([
          contactsAPI.getAll(),
          authAPI.getCurrentUser()
        ])
        setContacts(contactsData)
        setUser(userData)
      } catch (err) {
        setError('Failed to load data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Add new contact
  const handleAddContact = async (contactData) => {
    try {
      const newContact = await contactsAPI.create(contactData)
      // Add to state so it appears immediately
      setContacts([...contacts, newContact])
    } catch (err) {
      alert('Failed to add contact: ' + (err.response?.data?.message || err.message))
    }
  }

  // Delete contact
  const handleDelete = async (id) => {
    try {
      await contactsAPI.delete(id)
      // Remove from state
      setContacts(contacts.filter(c => c._id !== id))
    } catch (err) {
      alert('Failed to delete contact')
    }
  }

  // Open edit modal for a contact
  const handleEdit = (contact) => {
    setEditingContact(contact)
  }

  // Open view modal for a contact (uses getOne API)
  const handleView = (contactId) => {
    setViewingContactId(contactId)
  }

  // Update contact (called from EditContactModal)
  const handleUpdate = async (id, updatedData) => {
    try {
      const updatedContact = await contactsAPI.update(id, updatedData)
      // Update the contact in state
      setContacts(contacts.map(c => 
        c._id === id ? updatedContact : c
      ))
      // Close the modal
      setEditingContact(null)
    } catch (err) {
      alert('Failed to update contact: ' + (err.response?.data?.message || err.message))
    }
  }

  // Handle logout
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token')
    // Call parent function to switch view
    onLogout()
  }

  // Show loading state
  if (loading) {
    return (
      <div style={loadingStyle}>
        <p>Loading contacts...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header with user info and logout button */}
      <header style={headerStyle}>
        <div>
          <h1>My Contacts</h1>
          {user && <p style={{ margin: 0, fontSize: '14px' }}>Welcome, {user.username}!</p>}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onViewProfile} style={profileButtonStyle}>
            Profile
          </button>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      </header>

      <main style={mainStyle}>
        {/* Error message */}
        {error && <p style={errorStyle}>{error}</p>}

        {/* Add contact form */}
        <ContactForm onAddContact={handleAddContact} />

        {/* Contacts list */}
        <h2>Your Contacts ({contacts.length})</h2>
        
        {contacts.map(contact => (
          <ContactCard
            key={contact._id}
            name={contact.name}
            email={contact.email}
            phone={contact.phone}
            onView={() => handleView(contact._id)}
            onEdit={() => handleEdit(contact)}
            onDelete={() => handleDelete(contact._id)}
          />
        ))}

        {contacts.length === 0 && !error && (
          <p style={{ textAlign: 'center', color: '#888' }}>
            No contacts yet. Add your first contact above!
          </p>
        )}
      </main>

      {/* Edit Contact Modal - only shown when editingContact is not null */}
      {editingContact && (
        <EditContactModal
          contact={editingContact}
          onSave={handleUpdate}
          onCancel={() => setEditingContact(null)}
        />
      )}

      {/* View Contact Modal - fetches single contact by ID */}
      {viewingContactId && (
        <ContactDetailModal
          contactId={viewingContactId}
          onClose={() => setViewingContactId(null)}
        />
      )}
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

const logoutButtonStyle = {
  backgroundColor: 'white',
  color: '#4a90d9',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
}

const profileButtonStyle = {
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

export default Contacts
