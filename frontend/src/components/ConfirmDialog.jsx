import { useEffect } from 'react'

// ConfirmDialog.jsx - Reusable confirmation dialog
//
// USAGE:
// <ConfirmDialog
//   isOpen={showDialog}
//   title="Delete Contact"
//   message="Are you sure you want to delete this contact?"
//   confirmText="Delete"
//   cancelText="Cancel"
//   confirmStyle="danger" // 'danger' or 'primary'
//   onConfirm={() => handleDelete()}
//   onCancel={() => setShowDialog(false)}
// />

function ConfirmDialog({ 
  isOpen, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmStyle = 'danger', // 'danger' | 'primary'
  onConfirm, 
  onCancel 
}) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const confirmButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: confirmStyle === 'danger' ? '#e74c3c' : '#3498db',
    color: 'white'
  }

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={titleStyle}>{title}</h3>
        <p style={messageStyle}>{message}</p>
        
        <div style={buttonContainerStyle}>
          <button onClick={onCancel} style={cancelButtonStyle}>
            {cancelText}
          </button>
          <button onClick={onConfirm} style={confirmButtonStyle}>
            {confirmText}
          </button>
        </div>
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
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
}

const dialogStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '24px',
  maxWidth: '400px',
  width: '90%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
}

const titleStyle = {
  margin: '0 0 12px 0',
  fontSize: '18px',
  fontWeight: '600',
  color: '#333'
}

const messageStyle = {
  margin: '0 0 24px 0',
  color: '#666',
  lineHeight: '1.5'
}

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px'
}

const buttonBaseStyle = {
  padding: '10px 20px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500'
}

const cancelButtonStyle = {
  ...buttonBaseStyle,
  backgroundColor: '#f0f0f0',
  color: '#333'
}

export default ConfirmDialog
