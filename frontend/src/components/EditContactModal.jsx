import { useState } from 'react'

// EditContactModal.jsx - Modal popup to edit a contact
//
// MODAL PATTERN:
// A modal is a popup that appears over the page
// We show/hide it using state in the parent component

function EditContactModal({ contact, onSave, onCancel }) {
  // Pre-fill form with existing contact data
  const [name, setName] = useState(contact.name)
  const [email, setEmail] = useState(contact.email)
  const [phone, setPhone] = useState(contact.phone)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name || !email || !phone) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    
    // Call the onSave function passed from parent
    // with the contact ID and updated data
    await onSave(contact._id, { name, email, phone })
    
    setLoading(false)
  }

  return (
    // Overlay that covers the whole screen
    <div style={overlayStyle}>
      {/* Modal box */}
      <div style={modalStyle}>
        <h3>Edit Contact</h3>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />
          
          <div style={buttonContainerStyle}>
            <button 
              type="button" 
              onClick={onCancel}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={saveButtonStyle}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
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
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
}

const modalStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
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

const buttonContainerStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '15px'
}

const cancelButtonStyle = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#95a5a6',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer'
}

const saveButtonStyle = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer'
}

export default EditContactModal
