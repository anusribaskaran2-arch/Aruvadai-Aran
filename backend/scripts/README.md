# User Data Insertion Guide

This guide explains how to insert user data for the login page into MongoDB.

## Method 1: Using the Insert Script (Recommended)

This is the easiest method. The script will automatically hash the password and insert the user.

### Steps:

1. Make sure your `.env` file has the `MONGO_URI` configured
2. Run the script from the `backend` directory:

```bash
node scripts/insertUser.js <email> <password> [name]
```

### Examples:

```bash
# Insert user with email and password (name defaults to "Admin")
node scripts/insertUser.js user@example.com password123

# Insert user with email, password, and custom name
node scripts/insertUser.js farmer@example.com mypassword456 "Farmer Name"
```

## Method 2: Manual Insertion in MongoDB Compass

If you prefer to insert data directly in MongoDB Compass, follow these steps:

### Step 1: Generate Password Hash

First, generate a bcrypt hash for your password:

```bash
node scripts/generatePasswordHash.js yourpassword123
```

This will output a hash like: `$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Insert Document in MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `users` collection (or the collection name you're using)
4. Click "INSERT DOCUMENT"
5. Insert a document with this structure:

```json
{
  "name": "Admin",
  "email": "user@example.com",
  "password": "$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "createdAt": "2025-01-XX",
  "updatedAt": "2025-01-XX"
}
```

**Important Notes:**
- Replace `$2a$10$...` with the hash generated in Step 1
- The `email` must be unique (lowercase)
- The `password` must be at least 6 characters (before hashing)
- `createdAt` and `updatedAt` are optional (MongoDB will add them automatically if timestamps are enabled)

### Example Document:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
}
```

## User Schema Structure

The User model expects:
- `name` (String, optional, defaults to "Admin")
- `email` (String, required, unique, lowercase)
- `password` (String, required, minlength: 6, hashed with bcrypt)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

## Testing Login

After inserting a user, you can test the login at:
- Frontend: `login.html`
- API Endpoint: `POST /api/auth/login`
- Request Body: `{ "email": "user@example.com", "password": "yourpassword123" }`



