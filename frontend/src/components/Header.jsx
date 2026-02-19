// Header.jsx - A reusable header component
// 
// WHY: We create separate components so we can:
// 1. Reuse them in multiple places
// 2. Keep our code organized
// 3. Make changes in one place that apply everywhere

function Header() {
  return (
    <header style={headerStyle}>
      <h1>My Contacts</h1>
      <p>Manage your contacts easily</p>
    </header>
  )
}

// CSS-in-JS: You can write styles as JavaScript objects
// WHY: Keeps styles close to the component, easy to see what's styled
const headerStyle = {
  backgroundColor: '#4a90d9',
  color: 'white',
  padding: '20px',
  textAlign: 'center'
}

export default Header
