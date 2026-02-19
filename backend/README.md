# MyContacts Backend API

A fully-featured RESTful API for managing contacts with user authentication. Built with Node.js, Express, and MongoDB.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Code Walkthrough](#code-walkthrough)
  - [Entry Point (server.js)](#entry-point-serverjs)
  - [Database Connection](#database-connection-configdbconnectionjs)
  - [Constants](#constants-constantsjs)
  - [Models](#models)
  - [Routes](#routes)
  - [Controllers](#controllers)
  - [Middleware](#middleware)
- [Authentication Flow](#authentication-flow)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

---

## Overview

This is a Contact Management API that allows users to:
- Register and login with secure password hashing.
- Create, read, update, and delete their personal contacts.
- Access protected routes using JWT (JSON Web Tokens).

Each user can only access and manage **their own contacts**, ensuring data privacy and security.

---

## Features

- **User Authentication**: Register, login, and token-based authentication.
- **Password Security**: Passwords are hashed using bcrypt (never stored in plain text).
- **JWT Authorization**: Protected routes require valid JWT tokens.
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for contacts.
- **User Isolation**: Users can only access their own contacts.
- **Error Handling**: Centralized error handling with meaningful error messages.
- **Timestamps**: Automatic `createdAt` and `updatedAt` fields on all records.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database for data storage |
| **Mongoose** | MongoDB object modeling (ODM) |
| **bcrypt** | Password hashing |
| **jsonwebtoken** | JWT token generation and verification |
| **dotenv** | Environment variable management |
| **express-async-handler** | Async error handling wrapper |
| **nodemon** | Development server with auto-reload |

---

## Project Structure

| File/Folder | Purpose |
|-------------|---------|
| `config/dbConnection.js` | MongoDB connection setup |
| `controllers/contactController.js` | Contact CRUD logic |
| `controllers/userController.js` | User authentication logic |
| `middleware/errorHandler.js` | Centralized error handling |
| `middleware/validateTokenHandler.js` | JWT verification middleware |
| `models/contactModels.js` | Contact schema definition |
| `models/userModel.js` | User schema definition |
| `routes/contactRoutes.js` | Contact API routes |
| `routes/userRoutes.js` | User API routes |
| `.env` | Environment variables (not in git) |
| `constants.js` | HTTP status code constants |
| `server.js` | Application entry point |

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. **Clone the repository** and navigate into the project folder.

2. **Install dependencies** using `npm install`.

3. **Create a `.env` file** in the root directory (see [Environment Variables](#environment-variables)).

4. **Start the development server** using `npm run dev`.

5. **For production** use `npm start`.

The server will start on the port specified in your `.env` file (default: 5000).

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | The port number the server will run on | `5001` |
| `CONNECTION_STRING` | Your MongoDB connection URI | `mongodb+srv://<db_username>:<db_password>@cluster.mongodb.net/<database_name>` |
| `ACCESS_TOKEN_SECRET` | Secret key for signing JWT tokens (use a long, random string) | `mysupersecretkey123` |

> **Security Note**: Never commit your `.env` file to version control!

---

## API Endpoints

### User Routes (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/users/register` | Public | Register a new user |
| POST | `/api/users/login` | Public | Login and get access token |
| GET | `/api/users/current` | Private | Get current logged-in user info |
| PUT | `/api/users/email` | Private | Update user email (requires password) |
| PUT | `/api/users/password` | Private | Change user password |

### Contact Routes (`/api/contacts`)

> **Note**: All contact routes require authentication (Bearer token)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/contacts` | Private | Get all contacts for logged-in user |
| GET | `/api/contacts/:id` | Private | Get a specific contact by ID |
| POST | `/api/contacts` | Private | Create a new contact |
| PUT | `/api/contacts/:id` | Private | Update a contact |
| DELETE | `/api/contacts/:id` | Private | Delete a contact |

---

## Code Walkthrough

### Entry Point (`server.js`)

This is the main file that starts your application. Here's what each part does:

**Imports and Configuration:**
- **dotenv**: Loads environment variables from `.env` file into `process.env`, making sensitive data like database credentials accessible throughout the app without hardcoding them.
- **express**: The web framework that handles HTTP requests and responses.
- **connectDb**: Custom function to establish MongoDB connection.
- **errorHandler**: Custom middleware to handle all errors in one place.

**Database Connection:**
- `connectDb()` is called immediately to establish the MongoDB connection before the server starts accepting requests. This ensures the database is ready when users hit the API.

**Middleware Setup:**
- `express.json()`: Parses incoming requests with JSON payloads. Without this, `req.body` would be undefined when clients send JSON data.

**Route Mounting:**
- `/api/contacts` → All contact-related endpoints are handled by contactRoutes.
- `/api/users` → All user authentication endpoints are handled by userRoutes.
- This creates a clean URL structure: `/api/contacts/123` or `/api/users/login`.

**Error Handler Placement:**
- The error handler middleware is registered **last**. This is crucial because Express processes middleware in order, and errors from any route will flow down to this handler.

**Server Startup:**
- `app.listen()` starts the HTTP server. The callback confirms the server is running and shows which port to use.

---

### Database Connection (`config/dbConnection.js`)

This file contains a single async function that connects to MongoDB.

**Why async/await?**
Database connections are asynchronous operations (they take time and don't block other code). Using async/await makes the code readable and allows us to handle success/failure cleanly.

**Try/Catch Pattern:**
- **Success**: Logs the MongoDB host and database name for verification.
- **Failure**: Logs the error and calls `process.exit(1)` to terminate the application.

**Why exit on failure?**
If the database connection fails, the API cannot function — there's no data to serve. Exiting immediately prevents the server from running in a broken state. Exit code `1` indicates an error (vs `0` for success).

---

### Constants (`constants.js`)

This file exports an object containing HTTP status codes as named constants.

**Why use constants?**
- **Readability**: `constants.NOT_FOUND` is self-documenting, while `404` requires you to remember what it means.
- **Maintainability**: If you need to change a status code, change it in one file.
- **Prevents typos**: Using a constant prevents accidentally typing `405` instead of `404`.

**Status Codes Defined:**
| Constant | Value | Meaning |
|----------|-------|---------|
| VALIDATION_ERROR | 400 | Bad request / invalid input |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | Authenticated but not allowed |
| NOT_FOUND | 404 | Resource doesn't exist |
| SERVER_ERROR | 500 | Something went wrong on the server |

---

### Models

Models define the structure of documents stored in MongoDB collections. They use Mongoose schemas to enforce data types and validation.

#### User Model (`models/userModel.js`)

**Schema Fields:**

| Field | Type | Validation | Purpose |
|-------|------|------------|---------|
| `username` | String | Required | User's display name |
| `email` | String | Required, Unique | Login identifier (no duplicates allowed) |
| `password` | String | Required | Stored as a bcrypt hash, NEVER plain text |

**Schema Options:**
- `timestamps: true`: Mongoose automatically adds `createdAt` and `updatedAt` fields to every document, tracking when records are created and modified.

**Validation Messages:**
The `required` option accepts an array: `[true, "Error message"]`. The second element is the custom error message shown when validation fails.

#### Contact Model (`models/contactModels.js`)

**Schema Fields:**

| Field | Type | Validation | Purpose |
|-------|------|------------|---------|
| `user_id` | ObjectId | Required | Links contact to its owner |
| `name` | String | Required | Contact's name |
| `email` | String | Required | Contact's email |
| `phone` | String | Required | Contact's phone number |

**The `user_id` Field Explained:**
- **Type**: `mongoose.Schema.Types.ObjectId` — MongoDB's unique identifier format.
- **ref: "User"**: Creates a relationship to the User collection. This enables Mongoose's `populate()` feature to fetch the full user document if needed.
- **Purpose**: Links every contact to a specific user. When fetching contacts, we filter by `user_id` to ensure users only see their own data.

---

### Routes

Routes define the API endpoints and map them to controller functions. They act as a traffic controller, directing requests to the right handler.

#### User Routes (`routes/userRoutes.js`)

**Route Definitions:**

| HTTP Method | Path | Middleware | Handler | Access |
|-------------|------|------------|---------|--------|
| POST | /register | None | registerUser | Public |
| POST | /login | None | loginUser | Public |
| GET | /current | validateToken | getCurrentUser | Private |

**Why POST for register and login?**
- Sends sensitive data (passwords) in the request body, not the URL.
- Request body is encrypted with HTTPS; URLs can be logged.
- POST semantically means "submit data" or "create resource".

**Why is /current protected?**
The `/current` endpoint returns user information. Without authentication, anyone could access user data. The `validateToken` middleware ensures only logged-in users can access it.

#### Contact Routes (`routes/contactRoutes.js`)

**Route-Level Authentication:**
Instead of adding `validateToken` to each route individually, we use `router.use(validateToken)` at the top. This applies authentication to **ALL** routes in this file — cleaner and less error-prone.

**RESTful Route Design:**

| HTTP Method | Path | Action | REST Meaning |
|-------------|------|--------|--------------|
| GET | / | getContacts | List all resources |
| GET | /:id | getContact | Get single resource |
| POST | / | createContact | Create new resource |
| PUT | /:id | updateContact | Replace/update resource |
| DELETE | /:id | deleteContact | Remove resource |

**The `:id` Parameter:**
Express captures this from the URL. For `/api/contacts/abc123`, `req.params.id` equals `"abc123"`. This allows identifying which specific contact to fetch, update, or delete.

---

### Controllers

Controllers contain the business logic — they process requests, interact with the database, and send responses. They're where the "real work" happens.

#### User Controller (`controllers/userController.js`)

##### registerUser

This function handles new user registration.

**Process Flow:**
1. **Extract data**: Pulls `username`, `email`, and `password` from the request body.
2. **Validate**: Checks that all fields are present. Returns 400 error if any are missing.
3. **Check duplicates**: Searches for existing user with same email. Returns 400 if found.
4. **Hash password**: Uses bcrypt with 10 salt rounds. The salt rounds determine hashing complexity — higher is more secure but slower. 10 is a good balance.
5. **Create user**: Saves new user to MongoDB with hashed password.
6. **Return response**: Sends back user data (id, username, email) with 201 status. **Never return the password!**

**Why hash passwords?**
If the database is compromised, attackers get hashed values, not actual passwords. Bcrypt hashes cannot be reversed, only compared.

##### loginUser

This function authenticates users and issues JWT tokens.

**Process Flow:**
1. **Extract credentials**: Gets `email` and `password` from request body.
2. **Validate**: Ensures both fields are present.
3. **Find user**: Searches database by email.
4. **Verify password**: Uses `bcrypt.compare()` to check if the provided password matches the stored hash. This compares without ever decrypting the hash.
5. **Generate token**: Creates a JWT containing user info (username, email, id).
6. **Return token**: Sends the access token to the client.

**JWT Token Structure:**
- **Payload**: User data encoded in the token (username, email, id).
- **Secret**: Your `ACCESS_TOKEN_SECRET` signs the token.
- **Expiry**: Token expires in 1 hour (`expiresIn: "1h"`). After that, users must login again.

##### getCurrentUser

This is the simplest controller — it just returns `req.user`.

**Why so simple?**
The `validateToken` middleware has already:
1. Extracted the JWT from the Authorization header.
2. Verified it's valid and not expired.
3. Decoded the user info and attached it to `req.user`.

The controller just returns what's already there.

#### Contact Controller (`controllers/contactController.js`)

##### getContacts

Fetches all contacts for the logged-in user.

**Key Concept: User Isolation**
The query `{ user_id: req.user.id }` filters contacts to only return those belonging to the current user. Without this, users would see everyone's contacts!

##### getContact

Fetches a single contact by ID.

**Process:**
1. Extract `:id` from URL using `req.params.id`.
2. Use Mongoose's `findById()` to search by MongoDB's `_id` field.
3. Return 404 if not found.
4. Return the contact if found.

##### createContact

Creates a new contact linked to the current user.

**Key Feature: Automatic User Linking**
When creating the contact, we set `user_id: req.user.id`. The user doesn't need to provide their ID — we get it from their JWT token. This:
- Prevents users from creating contacts under other users' IDs.
- Simplifies the API (fewer fields to send).
- Ensures data integrity.

##### updateContact

Updates an existing contact with authorization checks.

**Security Check Explained:**
`contact.user_id.toString() !== req.user.id`

This comparison checks if the contact belongs to the logged-in user. Without this, any authenticated user could modify anyone's contacts by guessing IDs.

**The `{ new: true }` Option:**
By default, `findByIdAndUpdate()` returns the document **before** the update. With `new: true`, it returns the **updated** document — which is what we want to send back to the client.

##### deleteContact

Deletes a contact with the same authorization pattern.

**Same Security Pattern:**
Before deleting, we verify the contact belongs to the requesting user. This prevents users from deleting other users' contacts.

**Response:**
We return the deleted contact's data. This confirms what was deleted and allows the client to update its UI accordingly.

---

### Middleware

Middleware functions run between receiving a request and sending a response. They can modify requests, check conditions, or handle errors.

#### Error Handler (`middleware/errorHandler.js`)

This is a centralized error handling middleware that catches all errors thrown in the application.

**How Express Identifies Error Handlers:**
Error handling middleware has **4 parameters**: `(err, req, res, next)`. The extra `err` parameter tells Express this handles errors, not regular requests.

**The Switch Statement:**
Based on the HTTP status code set before the error was thrown, we return an appropriate error title. This provides consistent, user-friendly error responses.

**Response Structure:**
| Field | Purpose |
|-------|---------|
| title | Human-readable error category |
| message | Specific error description |
| stackTrace | Debugging info (remove in production!) |

**Why Centralized Error Handling?**
- **Consistency**: All errors follow the same format.
- **DRY**: Don't repeat error formatting in every route.
- **Maintainability**: Change error format in one place.

#### Token Validator (`middleware/validateTokenHandler.js`)

This middleware protects routes by verifying JWT tokens.

**Process Flow:**

1. **Extract Header**: Looks for `Authorization` header (checks both cases: `authorization` and `Authorization`).

2. **Parse Bearer Token**: The header format is `Bearer <token>`. We split by space and take the second part (the actual token).

3. **Check Token Exists**: If no token provided, return 401 Unauthorized immediately.

4. **Verify Token**: `jwt.verify()` does two things:
   - Checks the signature using your secret (ensures token wasn't tampered with).
   - Checks expiration (rejects expired tokens).
   
5. **Attach User**: The decoded token payload contains user info. We attach it to `req.user` so subsequent handlers can access it.

6. **Call next()**: Passes control to the next middleware or route handler.

**Why Use Try/Catch?**
`jwt.verify()` throws an error if the token is invalid or expired. The try/catch ensures we handle this gracefully with a 401 response instead of crashing.

---

## Authentication Flow

Understanding how authentication works end-to-end:

### 1. Registration
- User sends username, email, and password to `/api/users/register`.
- Server validates fields, checks for duplicate email.
- Password is hashed with bcrypt (never stored as plain text).
- User document is saved to MongoDB.
- Server returns user info (without password).

### 2. Login
- User sends email and password to `/api/users/login`.
- Server finds user by email.
- `bcrypt.compare()` checks password against stored hash.
- If valid, server creates a JWT containing user info.
- Server returns the access token.
- Client stores this token (usually in localStorage or a cookie).

### 3. Protected Request
- Client sends request to protected endpoint (e.g., `/api/contacts`).
- Client includes header: `Authorization: Bearer <token>`.
- `validateToken` middleware:
  - Extracts token from header.
  - Verifies signature and expiration.
  - Decodes user info and attaches to `req.user`.
- Route handler executes with access to `req.user`.
- Server returns the requested data.

### 4. Token Expiration
- Tokens expire after 1 hour.
- Expired tokens are rejected by `jwt.verify()`.
- Client must login again to get a new token.

---

## Error Handling

### How express-async-handler Works

Normally, async errors in Express require try/catch and calling `next(error)`. The `express-async-handler` package wraps async functions and automatically catches any thrown errors, passing them to Express's error handler.

**Without asyncHandler:**
You must wrap everything in try/catch and manually pass errors to next().

**With asyncHandler:**
Just throw errors normally — they're automatically caught and forwarded.

### Error Response Format

All errors return a consistent JSON structure:

| Field | Description |
|-------|-------------|
| `title` | Category of error (e.g., "Not found", "Unauthorized") |
| `message` | Specific error message |
| `stackTrace` | Stack trace for debugging (remove in production) |

### Common Error Scenarios

| Scenario | Status Code | Title |
|----------|-------------|-------|
| Missing required fields | 400 | Validation failed |
| Contact not found | 404 | Not found |
| Invalid/missing token | 401 | Unauthorized |
| Accessing other user's data | 403 | Forbidden |
| Database error | 500 | Internal Server Error |

---

## Usage Examples

### Register a New User

**Request:**
- Method: POST
- URL: `http://localhost:5001/api/users/register`
- Body: `{ "username": "John Doe", "email": "john@example.com", "password": "mypassword123" }`

**Response (201 Created):**
Returns user ID, username, and email (no password).

---

### Login

**Request:**
- Method: POST  
- URL: `http://localhost:5001/api/users/login`
- Body: `{ "email": "john@example.com", "password": "mypassword123" }`

**Response (200 OK):**
Returns an `accessToken` — a JWT string starting with "eyJ...".

---

### Create a Contact (Protected)

**Request:**
- Method: POST
- URL: `http://localhost:5001/api/contacts`
- Headers: `Authorization: Bearer eyJhbG...` (your token)
- Body: `{ "name": "Jane Smith", "email": "jane@example.com", "phone": "555-1234" }`

**Response (201 Created):**
Returns the created contact with `_id`, `user_id`, timestamps, etc.

---

### Get All Contacts (Protected)

**Request:**
- Method: GET
- URL: `http://localhost:5001/api/contacts`
- Headers: `Authorization: Bearer eyJhbG...`

**Response (200 OK):**
Returns an array of all contacts belonging to the logged-in user.

---

### Update a Contact (Protected)

**Request:**
- Method: PUT
- URL: `http://localhost:5001/api/contacts/:id` (replace :id with actual ID)
- Headers: `Authorization: Bearer eyJhbG...`
- Body: `{ "phone": "555-9999" }` (fields to update)

**Response (200 OK):**
Returns the updated contact document.

---

### Delete a Contact (Protected)

**Request:**
- Method: DELETE
- URL: `http://localhost:5001/api/contacts/:id`
- Headers: `Authorization: Bearer eyJhbG...`

**Response (200 OK):**
Returns the deleted contact's data.

---

## Security Best Practices Implemented

| Practice | Implementation |
|----------|----------------|
| Password Hashing | bcrypt with 10 salt rounds |
| Token-based Auth | JWT with 1-hour expiry |
| User Isolation | Contacts filtered by `user_id` |
| Authorization Checks | Verify ownership before update/delete |
| Environment Variables | Secrets stored in `.env`, not code |
| Input Validation | Required fields checked before processing |

---

## License

MIT License - see package.json for details.

---

## Author

**Josh Jack Thomson**

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.
