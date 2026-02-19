// ContactCard.jsx - Displays one contact
//
// PROPS EXPLAINED:
// Props are passed from parent component (like HTML attributes)
// Example: <ContactCard name="Josh" email="josh@email.com" />
// Then inside this component: props.name = "Josh", props.email = "josh@email.com"

function ContactCard({ name, email, phone, onView, onEdit, onDelete }) {
  // DESTRUCTURING: Instead of writing props.name, props.email, etc.
  // we can extract them directly: { name, email, phone, onView, onEdit, onDelete }
  // This is cleaner and easier to read
  
  return (
    <div style={cardStyle}>
      <h3>{name}</h3>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      
      <div style={buttonContainerStyle}>
        {/* View button - fetches single contact details */}
        <button onClick={onView} style={viewButtonStyle}>
          View
        </button>
        
        {/* Edit button */}
        <button onClick={onEdit} style={editButtonStyle}>
          Edit
        </button>
        
        {/* Delete button */}
        <button onClick={onDelete} style={deleteButtonStyle}>
          Delete
        </button>
      </div>
    </div>
  )
}

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '15px',
  margin: '10px 0',
  backgroundColor: '#f9f9f9'
}

const buttonContainerStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '10px'
}

const viewButtonStyle = {
  backgroundColor: '#9b59b6',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer'
}

const editButtonStyle = {
  backgroundColor: '#3498db',
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

export default ContactCard
