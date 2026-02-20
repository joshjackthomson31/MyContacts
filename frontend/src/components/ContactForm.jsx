import { useState } from 'react'

// ContactForm.jsx - Form to add a new contact
//
// CONTROLLED COMPONENTS EXPLAINED:
// In regular HTML, form inputs (like <input>) manage their own state
// In React, WE control the input's value using state
// This gives us full control over the form data

function ContactForm({ onAddContact }) {
  // Separate state for each input field
  // Every keystroke updates the state, which updates the input
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Handle form submission
  const handleSubmit = (e) => {
    // e.preventDefault() stops the browser from refreshing the page
    // By default, forms refresh the page when submitted
    // We don't want that in React - we handle it ourselves
    e.preventDefault()

    // Basic validation
    if (!name || !email || !phone) {
      alert('Please fill all fields')
      return
    }

    // Create new contact object
    const newContact = {
      id: Date.now(), // Simple unique ID for now
      name,
      email,
      phone
    }

    // Call the function passed from parent (App.jsx)
    // This is how child components communicate with parents
    onAddContact(newContact)

    // Clear the form (reset state to empty strings)
    setName('')
    setEmail('')
    setPhone('')
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={{ color: '#333' }}>Add New Contact</h3>
      
      {/* CONTROLLED INPUT EXPLAINED:
          value={name} - The input always shows what's in state
          onChange={...} - Every keystroke updates state
          e.target.value - The current text in the input
      */}
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
      
      <button type="submit" style={buttonStyle}>
        Add Contact
      </button>
    </form>
  )
}

const formStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '8px 0',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '16px'
}

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  marginTop: '10px'
}

export default ContactForm
