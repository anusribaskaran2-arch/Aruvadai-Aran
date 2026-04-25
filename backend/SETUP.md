# Backend Setup Instructions

## Quick Start

### 1. Create .env File

Create a `.env` file in the `backend` directory with the following content:

```env
# MongoDB Connection (default if not set)
MONGO_URI=mongodb://localhost:27017/farmvault

# Server Port
PORT=5000

# JWT Secret for authentication
JWT_SECRET=aruvadai-aran-secret-key-change-in-production

# Email Configuration (Optional - contact form will work without these)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# SUPPORT_EMAIL=support@example.com
```

**Note:** If you don't create a `.env` file, the server will use default values:
- MongoDB: `mongodb://localhost:27017/farmvault`
- Port: `5000`

### 2. Install Dependencies (if not already done)

```bash
cd backend
npm install
```

### 3. Start the Server

```bash
# For production
npm start

# OR for development (with auto-reload)
npm run dev
```

### 4. Verify Server is Running

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

Test the health endpoint in your browser:
```
http://localhost:5000/api/health
```

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB on your system
2. Start MongoDB service
3. The default connection string will work: `mongodb://localhost:27017/farmvault`

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGO_URI` in `.env` file:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/farmvault
   ```

## Troubleshooting

### "Failed to fetch" Error

This means the backend server is not running. Make sure:
1. Server is started with `npm start` or `npm run dev`
2. No errors in the console
3. Port 5000 is not being used by another application

### MongoDB Connection Error

- Make sure MongoDB is running (if using local MongoDB)
- Check your connection string in `.env`
- Verify network connectivity (if using MongoDB Atlas)

### Port Already in Use

If port 5000 is already in use:
1. Change `PORT` in `.env` file to a different port (e.g., `5001`)
2. Update `BACKEND_URL` in `frontend/script.js` to match the new port

## Next Steps

After the server is running:
1. Test login page: Should connect to `/api/auth/login`
2. Test contact page: Should connect to `/api/contact`
3. Add a test user using the script: `node scripts/insertUser.js email@example.com password123`

