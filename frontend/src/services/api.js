import axios from 'axios'

// API SERVICE EXPLAINED:
// This file centralizes all API calls in one place
// WHY: 
// 1. If the API URL changes, we only update it here
// 2. We can add authentication headers in one place
// 3. Components stay clean - they just call these functions

// Base URL of your backend
const API_URL = 'http://localhost:5001/api'

// Create an axios instance with default config
// This means we don't have to repeat the base URL every time
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// INTERCEPTOR: Runs before every request
// We use this to automatically add the auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (where we'll store it after login)
    const token = localStorage.getItem('token')
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// AUTH API CALLS
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    // userData = { username, email, password }
    const response = await api.post('/users/register', userData)
    return response.data
  },

  // Login user
  login: async (credentials) => {
    // credentials = { email, password }
    const response = await api.post('/users/login', credentials)
    return response.data
  },

  // Get current user info
  getCurrentUser: async () => {
    const response = await api.get('/users/current')
    return response.data
  }
}

// CONTACTS API CALLS
export const contactsAPI = {
  // Get all contacts for logged-in user
  getAll: async () => {
    const response = await api.get('/contacts')
    return response.data
  },

  // Get single contact
  getOne: async (id) => {
    const response = await api.get(`/contacts/${id}`)
    return response.data
  },

  // Create new contact
  create: async (contactData) => {
    // contactData = { name, email, phone }
    const response = await api.post('/contacts', contactData)
    return response.data
  },

  // Update a contact
  update: async (id, contactData) => {
    const response = await api.put(`/contacts/${id}`, contactData)
    return response.data
  },

  // Delete a contact
  delete: async (id) => {
    const response = await api.delete(`/contacts/${id}`)
    return response.data
  }
}

export default api
