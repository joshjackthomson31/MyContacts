# MyContacts Frontend

A modern React application for managing personal contacts. This frontend connects to the MyContacts Backend API to provide a complete contact management solution with user authentication.

---

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [Pages and Components](#pages-and-components)
  - [Login Page](#login-page)
  - [Register Page](#register-page)
  - [Contacts Page](#contacts-page)
  - [Profile Page](#profile-page)
  - [ContactCard Component](#contactcard-component)
  - [ContactForm Component](#contactform-component)
  - [EditContactModal Component](#editcontactmodal-component)
  - [ContactDetailModal Component](#contactdetailmodal-component)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [State Management](#state-management)
- [Styling Approach](#styling-approach)
- [React Concepts Used](#react-concepts-used)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Overview

This is a Single Page Application built with React and Vite. It provides a user-friendly interface for managing contacts with features like user registration, login, viewing contacts, adding new contacts, editing existing contacts, and deleting contacts. The application communicates with a Node.js backend API and stores authentication tokens in the browser's localStorage.

---

## Technologies Used

### Core Technologies

React is the JavaScript library used for building the user interface. React allows us to create reusable components and efficiently update the DOM when data changes.

Vite is the build tool and development server. It provides fast hot module replacement during development and optimized builds for production.

Axios is the HTTP client library used for making API requests to the backend. It provides a clean API for handling requests and responses.

### Development Tools

ESLint is used for code linting to maintain code quality and consistency.

JavaScript with JSX syntax is used throughout the project. JSX allows us to write HTML-like code within JavaScript.

---

## Project Structure

The project follows a standard React application structure with clear separation of concerns.

### Root Directory

The index.html file is the single HTML page that React renders into. It contains a div with id root where the entire React application mounts.

The vite.config.js file contains Vite configuration options for the build process.

The package.json file lists all project dependencies and scripts for running the application.

The eslint.config.js file contains ESLint rules for code linting.

### Source Directory

The src folder contains all the application source code.

The main.jsx file is the entry point of the application. It renders the App component into the root div.

The App.jsx file is the main application component. It handles authentication state and decides which page to display based on whether the user is logged in.

The App.css file contains application-specific styles.

The index.css file contains global styles that apply to the entire application.

### Components Directory

The src/components folder contains reusable UI components.

The Header.jsx file contains the header component that displays the application title.

The ContactCard.jsx file contains the component that displays a single contact with name, email, phone, and action buttons for viewing details, editing, and deleting.

The ContactForm.jsx file contains the form component used for adding new contacts. It handles form state and validation.

The EditContactModal.jsx file contains a modal popup component for editing existing contacts. It pre-fills the form with current contact data.

The ContactDetailModal.jsx file contains a modal popup component for viewing detailed information about a single contact. It fetches fresh data from the API using the getOne function and displays the contact ID, creation date, and last updated date.

### Pages Directory

The src/pages folder contains full-page components.

The Login.jsx file contains the login page with email and password inputs. It handles authentication and stores the token on successful login.

The Register.jsx file contains the registration page with username, email, password, and confirm password inputs. It validates input before sending to the API.

The Contacts.jsx file contains the main contacts page. It displays all contacts, handles adding, editing, and deleting contacts, and fetches data from the API on mount.

The Profile.jsx file contains the user profile page. It displays the current user's information including username, email, and user ID.

### Services Directory

The src/services folder contains API communication code.

The api.js file contains all API configuration and functions. It creates an Axios instance with the base URL and sets up request interceptors to automatically attach authentication tokens.

---

## Getting Started

### Prerequisites

Node.js version 18 or higher must be installed on your system.

npm comes bundled with Node.js and is used for package management.

The backend API must be running on port 5001 for the frontend to communicate with it.

### Installation Steps

First, navigate to the project directory in your terminal.

Run npm install to install all dependencies. This will download React, Vite, Axios, and other required packages.

### Running the Application

Run npm run dev to start the development server. The application will be available at http://localhost:5173 or the next available port.

The development server supports hot module replacement, meaning changes you make to the code will appear instantly in the browser without a full page refresh.

### Building for Production

Run npm run build to create a production build. This creates an optimized bundle in the dist folder.

Run npm run preview to preview the production build locally.

---

## Features

### User Authentication

Users can register for a new account by providing a username, email, and password.

Registered users can log in with their email and password.

Authentication tokens are stored in localStorage to persist sessions.

Users can log out, which clears the token and returns to the login page.

### Contact Management

Users can view all their contacts in a list format.

Each contact displays the name, email, and phone number.

Users can view detailed information about a specific contact by clicking the View button. This opens a modal that fetches fresh data from the API and displays additional information like contact ID, creation date, and last updated date.

Users can add new contacts using the contact form.

Users can edit existing contacts by clicking the Edit button, which opens a modal with pre-filled data.

Users can delete contacts by clicking the Delete button.

All contact operations are persisted to the backend database.

### User Profile

Users can view their profile information including username, email, and user ID.

The profile page displays a visual avatar with the user's initial.

Users can update their email address by clicking the Update Email button and providing their current password for verification.

Users can change their password by clicking the Change Password button and entering their current password along with the new password.

---

## Pages and Components

### Login Page

The login page displays when the user is not authenticated. It contains two input fields for email and password, a login button, and a link to switch to the registration page. On successful login, the access token is stored in localStorage and the user is redirected to the contacts page.

### Register Page

The register page allows new users to create an account. It contains four input fields for username, email, password, and confirm password. Client-side validation ensures passwords match and meet minimum length requirements. On successful registration, the user is redirected to the login page.

### Contacts Page

The contacts page is the main view after login. It displays a header with the app name, a welcome message with the username, a Profile button, and a Logout button. Below the header is the add contact form followed by a list of all contacts. Each contact is rendered as a ContactCard component with View, Edit, and Delete buttons.

### Profile Page

The profile page shows detailed user information. It displays an avatar circle with the user's initial, the username, email address, user ID, and account status. A back button returns the user to the contacts page.

The profile page includes two action buttons for managing account settings. The Update Email button reveals a form where users can enter a new email address and their current password for verification. The Change Password button reveals a form for entering the current password, new password, and password confirmation. Both forms include validation and display success or error messages.

### ContactCard Component

The ContactCard component displays a single contact. It receives props for name, email, phone, onView function, onEdit function, and onDelete function. The component renders the contact information with three action buttons for viewing details, editing, and deleting.

### ContactForm Component

The ContactForm component handles adding new contacts. It uses controlled inputs with useState for each field. The form validates that all fields are filled before submission. On submit, it calls the onAddContact function passed as a prop and clears the form.

### EditContactModal Component

The EditContactModal component displays as a popup overlay. It receives the contact to edit and pre-fills the form fields. On save, it calls the onSave function with the contact ID and updated data. The modal can be closed by clicking Cancel.

### ContactDetailModal Component

The ContactDetailModal component displays as a popup overlay for viewing detailed contact information. It receives only the contact ID and fetches fresh data from the API using contactsAPI.getOne. This demonstrates how to fetch a single resource by ID. The modal displays the contact avatar with the initial, name, email, phone, contact ID, creation timestamp, and last updated timestamp. The modal can be closed by clicking outside it or pressing the Close button.

---

## API Integration

### API Configuration

The api.js file creates an Axios instance configured with the backend base URL of http://localhost:5001/api.

Request interceptors automatically attach the Bearer token from localStorage to every request's Authorization header.

### Authentication API Functions

The authAPI.register function sends a POST request to /users/register with username, email, and password.

The authAPI.login function sends a POST request to /users/login with email and password. It returns the access token.

The authAPI.getCurrentUser function sends a GET request to /users/current to retrieve the logged-in user's information.

The authAPI.updateEmail function sends a PUT request to /users/email with the new email and current password. It returns a new access token since the email is embedded in the JWT payload.

The authAPI.changePassword function sends a PUT request to /users/password with the current password and new password.

### Contacts API Functions

The contactsAPI.getAll function sends a GET request to /contacts to retrieve all contacts for the logged-in user.

The contactsAPI.getOne function sends a GET request to /contacts/:id to retrieve a single contact by ID. This is used by the ContactDetailModal component to fetch fresh contact data including timestamps.

The contactsAPI.create function sends a POST request to /contacts with name, email, and phone to create a new contact.

The contactsAPI.update function sends a PUT request to /contacts/:id with updated contact data.

The contactsAPI.delete function sends a DELETE request to /contacts/:id to remove a contact.

---

## Authentication Flow

When the application loads, it checks localStorage for an existing token.

If a token exists, the user is considered logged in and the Contacts page is displayed.

If no token exists, the Login page is displayed.

On successful login, the token from the API response is stored in localStorage.

The token is automatically attached to all subsequent API requests via the Axios interceptor.

On logout, the token is removed from localStorage and the user is redirected to the login page.

If the token expires or becomes invalid, API requests will fail with a 401 error.

---

## State Management

This application uses React's built-in useState hook for local component state.

Each component manages its own state for form inputs, loading indicators, and error messages.

The App component manages global authentication state using useState for isLoggedIn, showRegister, currentPage, and checkingAuth.

State is passed down to child components via props.

Child components communicate with parents through callback functions passed as props.

The useEffect hook is used to perform side effects like fetching data when components mount.

---

## Styling Approach

This application uses CSS-in-JS with inline style objects.

Each component defines its styles as JavaScript objects at the bottom of the file.

This approach keeps styles close to the components they affect.

Global styles are defined in index.css for resets and base styling.

The color scheme uses a blue primary color (#4a90d9) with white, green (#27ae60) for success actions, and red (#e74c3c) for delete actions.

---

## React Concepts Used

### Components

Components are reusable pieces of UI. Each file in the components and pages folders exports a single component. Components are functions that return JSX.

### JSX

JSX is a syntax extension that allows writing HTML-like code in JavaScript. Elements use className instead of class. JavaScript expressions are wrapped in curly braces.

### Props

Props are how data is passed from parent to child components. Props are received as the first parameter of a component function. Destructuring is used to extract specific props.

### State

State is data that can change over time. The useState hook is used to create state variables. When state changes, React re-renders the component.

### Effects

The useEffect hook runs code after the component renders. It is used for API calls, subscriptions, and other side effects. The dependency array controls when the effect runs.

### Conditional Rendering

Components can render different content based on conditions. This is done using logical AND operators or ternary expressions. Examples include showing loading states and error messages.

### Lists and Keys

The map function is used to render lists of components. Each item in a list needs a unique key prop. Keys help React identify which items changed.

### Events

Event handlers are functions that run when users interact with elements. Common events include onClick, onSubmit, and onChange. Event handlers are passed as props.

### Controlled Components

Form inputs are controlled by React state. The value prop is set to the state variable. The onChange handler updates the state on each keystroke.

---

## Configuration

### Environment Variables

The API base URL is currently hardcoded in src/services/api.js. To change the backend URL, modify the API_URL constant.

### Port Configuration

By default, Vite runs the development server on port 5173. If that port is in use, it will automatically use the next available port.

### Backend Connection

The frontend expects the backend to be running on http://localhost:5001. Ensure the backend server is started before using the frontend.

CORS must be enabled on the backend to allow requests from the frontend origin.

---

## Troubleshooting

### Network Error on Login or Register

Ensure the backend server is running on port 5001.

Check that CORS is enabled in the backend server.js file.

Verify there are no firewall restrictions blocking the connection.

### Registration Failed

Check the browser console for detailed error messages.

Ensure all fields are filled correctly.

Verify the email is not already registered.

### Contacts Not Loading

Ensure you are logged in with a valid token.

Check that the backend is connected to MongoDB.

Look for errors in the browser console.

### UI Alignment Issues

Clear your browser cache.

Ensure index.css does not have conflicting styles.

Check that no browser extensions are injecting styles.

### Token Expired

If you see 401 errors, your token may have expired.

Log out and log back in to get a fresh token.

Tokens expire after one hour by default.
