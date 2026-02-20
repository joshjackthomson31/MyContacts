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

function Contacts({ onLogout, onViewProfile, onViewTrash }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // State for current user info
  const [user, setUser] = useState(null)
  
  // State for editing - which contact is being edited (null = none)
  const [editingContact, setEditingContact] = useState(null)
  
  // State for viewing - which contact ID is being viewed (null = none)
  const [viewingContactId, setViewingContactId] = useState(null)

  // Search and sort state
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date') // 'date', 'date-asc', 'name', 'name-desc'

  // Fetch contacts with search and sort
  const fetchContacts = async (search = '', sort = 'date') => {
    try {
      const contactsData = await contactsAPI.getAll(search, sort)
      setContacts(contactsData)
    } catch (err) {
      setError('Failed to load contacts')
      console.error(err)
    }
  }

  // useEffect to load contacts and user info when page opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contacts and user info in parallel
        const [contactsData, userData] = await Promise.all([
          contactsAPI.getAll('', sortBy),
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

  // Handle search - debounced effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts(searchTerm, sortBy)
    }, 300) // Wait 300ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchTerm, sortBy])

  // Add new contact
  const handleAddContact = async (contactData) => {
    try {
      const newContact = await contactsAPI.create(contactData)
      // Refresh contacts to maintain sort order
      fetchContacts(searchTerm, sortBy)
    } catch (err) {
      alert('Failed to add contact: ' + (err.response?.data?.message || err.message))
    }
  }

  // Delete contact (soft delete - moves to trash)
  const handleDelete = async (id) => {
    try {
      await contactsAPI.delete(id)
      // Remove from state
      setContacts(contacts.filter(c => c._id !== id))
    } catch (err) {
      alert('Failed to delete contact')
    }
  }

  // Toggle favorite status
  const handleToggleFavorite = async (id) => {
    try {
      const updatedContact = await contactsAPI.toggleFavorite(id)
      // Update the contact in state
      setContacts(contacts.map(c => 
        c._id === id ? updatedContact : c
      ))
    } catch (err) {
      alert('Failed to update favorite status')
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

  // Sort contacts: favorites first, then by current sort
  const sortedContacts = [...contacts].sort((a, b) => {
    // Favorites always come first
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return 0 // Keep existing sort order from API
  })

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
          <button onClick={onViewTrash} style={trashButtonStyle}>
            Trash
          </button>
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

        {/* Search and Sort Controls */}
        <div style={searchSortContainerStyle}>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={sortSelectStyle}
          >
            <option value="date">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>

        {/* Contacts list */}
        <h2>Your Contacts ({contacts.length})</h2>
        
        {sortedContacts.map(contact => (
          <ContactCard
            key={contact._id}
            name={contact.name}
            email={contact.email}
            phone={contact.phone}
            isFavorite={contact.isFavorite}
            onView={() => handleView(contact._id)}
            onEdit={() => handleEdit(contact)}
            onDelete={() => handleDelete(contact._id)}
            onToggleFavorite={() => handleToggleFavorite(contact._id)}
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

const trashButtonStyle = {
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

const searchSortContainerStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '20px'
}

const searchInputStyle = {
  flex: 1,
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px'
}

const sortSelectStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  backgroundColor: 'white',
  color: '#333',
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

export default Contacts
