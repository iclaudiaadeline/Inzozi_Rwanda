# INZOZI - Complete Setup Guide

## Overview

This project now includes a full-stack implementation with:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Database**: SQLite (easily switchable to PostgreSQL)
- **Authentication**: JWT-based

## What Was Changed

### 1. Removed Parent & Donor Dashboards
- ✅ Removed Parent and Donor dashboard routes
- ✅ Removed Parent/Donor from authentication options
- ✅ Updated landing page to show only Student and Teacher options
- ✅ Added "Become a Donor" card linking to Google Form: https://forms.gle/BhC5i88nG4SDJUY79

### 2. Backend Implementation
- ✅ Created complete backend API with Express.js
- ✅ Implemented JWT authentication
- ✅ Created database schema with Prisma
- ✅ Built API endpoints for:
  - Authentication (signup, login)
  - Student profiles and quiz system
  - Teacher profiles and gamification
  - Admin dashboard statistics

### 3. Frontend Integration
- ✅ Created API client for backend communication
- ✅ Updated Auth page to use real API
- ✅ Updated Student Dashboard to fetch data from API
- ✅ Updated Teacher Dashboard to fetch data from API
- ✅ Updated Admin Dashboard to fetch data from API

## Setup Instructions

### Step 1: Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment:**
   - The `.env` file should already exist with default values
   - For production, change `JWT_SECRET` to a secure random string
   - Update `CORS_ORIGIN` if your frontend runs on a different port

4. **Initialize database:**
```bash
npm run db:generate
npm run db:push
```

5. **Start backend server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 2: Frontend Setup

1. **Navigate to project root:**
```bash
cd ..
```

2. **Create environment file:**
   Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Install dependencies (if not already done):**
```bash
npm install
```

4. **Start frontend:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### Step 3: Test the Application

1. Open `http://localhost:5173` in your browser
2. Click "Get Started" or navigate to `/auth`
3. Create a new account:
   - Choose a role: Student, Teacher, or Admin
   - Fill in your details
   - Click "Create Account"
4. You'll be automatically logged in and redirected to your dashboard

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Student
- `GET /api/student/profile` - Get student profile
- `POST /api/student/quiz` - Submit quiz results
- `GET /api/student/quiz/results` - Get quiz results

### Teacher
- `GET /api/teacher/profile` - Get teacher profile
- `POST /api/teacher/feedback` - Submit student feedback
- `GET /api/teacher/students` - Get students list

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users/role-distribution` - Get user distribution
- `GET /api/admin/students/at-risk` - Get at-risk students

## Database Schema

The database includes:
- **User**: Base user table with authentication
- **StudentProfile**: Student-specific data (attendance, performance, interests)
- **TeacherProfile**: Teacher-specific data (points, level, achievements)
- **QuizResult**: Student quiz submissions
- **StudentFeedback**: Teacher feedback submissions
- **Achievement**: Teacher achievements
- **DonorSubmission**: Donor form submissions (from Google Forms)

## Donor Form Integration

The donor registration form is integrated via Google Forms:
- **Link**: https://forms.gle/BhC5i88nG4SDJUY79
- Appears on homepage as "Become a Donor" card
- Opens in a new tab when clicked
- Donor submissions can be viewed in Admin Dashboard (when Google Forms API is integrated)

## Troubleshooting

### Backend Issues

**Port already in use:**
- Change `PORT` in `backend/.env` to a different port (e.g., 5001)
- Update `VITE_API_URL` in frontend `.env` accordingly

**Database errors:**
- Delete `backend/dev.db` and `backend/dev.db-journal`
- Run `npm run db:push` again

**CORS errors:**
- Verify `CORS_ORIGIN` in `backend/.env` matches your frontend URL exactly
- Default: `http://localhost:5173`

### Frontend Issues

**Can't connect to backend:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `.env` file
- Check browser console for error messages

**Authentication not working:**
- Clear browser localStorage
- Verify JWT_SECRET is set in backend `.env`
- Check that tokens are being stored in localStorage

### Database Management

**View database:**
```bash
cd backend
npm run db:studio
```
Opens Prisma Studio at `http://localhost:5555`

**Reset database:**
```bash
cd backend
rm dev.db dev.db-journal
npm run db:push
```

## Next Steps

1. **Production Deployment:**
   - Switch to PostgreSQL
   - Set secure environment variables
   - Deploy backend to a server (Heroku, Railway, etc.)
   - Deploy frontend to Vercel, Netlify, etc.

2. **Google Forms Integration:**
   - Set up Google Forms API
   - Create webhook to sync donor submissions to database
   - Display donor submissions in Admin Dashboard

3. **Additional Features:**
   - Email notifications
   - Payment gateway integration
   - File uploads
   - Real-time notifications
   - Advanced analytics

## File Structure

```
Inzozi_Rwanda/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── README.md
├── src/
│   ├── lib/
│   │   └── api.ts
│   ├── pages/
│   │   ├── Auth.tsx
│   │   └── dashboards/
│   └── ...
├── package.json
└── README.md
```

## Support

For issues or questions:
1. Check the backend README: `backend/README.md`
2. Check browser console for errors
3. Check backend terminal for errors
4. Verify all environment variables are set correctly

## Environment Variables Summary

### Backend (.env in backend/)
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `CORS_ORIGIN` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

### Frontend (.env in root/)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

---

**Happy Coding! 🚀**


