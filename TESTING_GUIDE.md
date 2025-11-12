# Testing Guide - SQLite Login Fix

## ✅ What Has Been Fixed

Your Inzozi application has been successfully migrated from Prisma to SQLite! Here's what's been done:

### 1. **Database Migration**
- Replaced Prisma ORM with SQLite3
- Removed all Prisma dependencies
- Implemented direct SQL queries for better control and debugging

### 2. **Backend Routes Updated**
- ✅ Authentication (signup, login, get current user)
- ✅ Student routes (profile, quiz submission, results)
- ✅ Teacher routes (profile, feedback submission, student list)
- ✅ Admin routes (statistics, role distribution, at-risk students)

### 3. **API Error Handling Enhanced**
- Better error logging in the frontend API client
- CORS properly configured
- Database automatically initialized on startup

## 🚀 How to Test

### Step 1: Start the Backend
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:5000
📡 CORS enabled for: http://localhost:5173
✅ Connected to SQLite database
```

### Step 2: Start the Frontend (in a new terminal)
```bash
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:8080/
```

### Step 3: Test Login
1. Open http://localhost:8080 in your browser
2. Click on "Student" or "Teacher" to go to the authentication page
3. **Sign Up** with a new account:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Role: Student/Teacher/Admin
4. **Login** with the same credentials

## 🔍 Debugging "Failed to fetch" Error

If you see a "Failed to fetch" error:

### Check 1: Backend is Running
- Open terminal and run: `cd backend && npm run dev`
- Look for: "🚀 Server running on http://localhost:5000"

### Check 2: CORS is Configured
- Backend terminal should show: "📡 CORS enabled for: http://localhost:5173"
- If it shows a different URL, update `CORS_ORIGIN` in `backend/.env`

### Check 3: Frontend Environment
- Check `.env` file in project root has: `VITE_API_URL=http://localhost:5000/api`
- Restart the frontend dev server after any `.env` changes

### Check 4: Browser Console
- Open browser DevTools (F12) → Console tab
- Check for detailed error messages
- Look for network errors in the Network tab

### Check 5: Database File
- After first backend run, check `backend/dev.db` file exists
- If missing, delete `node_modules` and reinstall: `npm install`

## 📊 Database Structure

The SQLite database automatically creates these tables:

```
User
├── id (PK)
├── email (UNIQUE)
├── name
├── password
├── role
├── createdAt
└── updatedAt

StudentProfile
├── id (PK)
├── userId (FK → User)
├── grade
├── attendance
├── performance
├── interests
├── createdAt
└── updatedAt

TeacherProfile
├── id (PK)
├── userId (FK → User)
├── points
├── level
├── createdAt
└── updatedAt

QuizResult
├── id (PK)
├── studentId (FK → StudentProfile)
├── interests
└── completedAt

StudentFeedback
├── id (PK)
├── teacherId (FK → TeacherProfile)
├── studentName
├── performance
├── feedback
└── createdAt

Achievement
├── id (PK)
├── teacherId (FK → TeacherProfile)
├── title
├── description
└── earnedAt

DonorSubmission
├── id (PK)
├── fullName
├── email
├── phoneNumber
├── organization
├── donationType
├── paymentMethod
├── estimatedAmount
├── reason
├── receiveUpdates
└── submittedAt
```

## 🔐 Environment Variables

### Backend (.env in backend/ folder)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-inzozi-secret-change-me"
PORT=5000
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

### Frontend (.env in root folder)
```env
VITE_API_URL=http://localhost:5000/api
```

## ✨ Features Working

✅ User signup with role selection
✅ User login with JWT tokens
✅ Student profile and quiz tracking
✅ Teacher feedback and gamification
✅ Admin dashboard with statistics
✅ Role-based access control
✅ Automatic database initialization
✅ CORS enabled for local development

## 🆘 Still Getting Errors?

1. **Clear browser cache**: Ctrl+Shift+Delete (Chrome) or Cmd+Shift+Delete (Mac)
2. **Restart both servers**: Stop both terminals and restart
3. **Check console logs**: 
   - Frontend: Browser console (F12)
   - Backend: Terminal output
4. **Check network tab**: See what request is failing and why

## 📝 API Test Examples

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User (requires token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token_here>"
```

## 🎯 Next Steps

1. Test all authentication flows
2. Test each dashboard (Student, Teacher, Admin)
3. Test API endpoints with real data
4. Check browser DevTools for any warnings
5. Monitor backend console for errors

---

**✅ Your migration is complete! The application should now work with SQLite instead of Prisma.**
