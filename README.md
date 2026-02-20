# MyContacts App

A full-stack contact management application built with React and Node.js.

---

## Project Structure

```
mycontacts-app/
├── backend/          # Node.js + Express API
│   ├── config/       # Database configuration
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── server.js     # Entry point
│
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── services/     # API communication
│   └── index.html
│
└── package.json      # Root scripts for running both
```

---

## Quick Start

### Prerequisites

Node.js version 18 or higher must be installed.

MongoDB Atlas account or local MongoDB instance is required for the database.

### Installation

Clone the repository and install all dependencies.

```bash
git clone https://github.com/joshjackthomson31/MyContacts.git
cd MyContacts
npm install
npm run install:all
```

### Configuration

Create a .env file in the backend folder with the following variables.

```
PORT=5001
CONNECTION_STRING=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret_key
```

### Running the Application

Start both frontend and backend with a single command.

```bash
npm start
```

Or run them separately.

```bash
# Terminal 1 - Backend (port 5001)
npm run start:backend

# Terminal 2 - Frontend (port 5173)
npm run start:frontend
```

---

## Technologies

### Backend

Node.js and Express.js for the server.

MongoDB with Mongoose for the database.

JWT for authentication.

bcrypt for password hashing.

### Frontend

React 19 with Vite for fast development.

Axios for API requests.

CSS-in-JS for styling.

---

## Features

User registration and login with JWT authentication.

Create, read, update, and delete contacts.

View detailed contact information.

User profile page with account management.

Update email address with password verification.

Change password functionality.

Responsive design.

---

## API Endpoints

### Authentication

POST /api/users/register - Register a new user.

POST /api/users/login - Login and get access token.

GET /api/users/current - Get current user info (requires auth).

PUT /api/users/email - Update email address (requires auth).

PUT /api/users/password - Change password (requires auth).

### Contacts

GET /api/contacts - Get all contacts for logged-in user.

GET /api/contacts/:id - Get a single contact.

POST /api/contacts - Create a new contact.

PUT /api/contacts/:id - Update a contact.

DELETE /api/contacts/:id - Delete a contact.

---

## Scripts

The root package.json provides convenient scripts.

npm install - Install root dependencies.

npm run install:all - Install both backend and frontend dependencies.

npm start - Run both backend and frontend concurrently.

npm run start:backend - Run only the backend.

npm run start:frontend - Run only the frontend.

npm run build:frontend - Build the frontend for production.
