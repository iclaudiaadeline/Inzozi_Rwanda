# INZOZI - Education Platform for Rwanda 
> Empowering Education in Rwanda Through Technology

INZOZI is a comprehensive education support platform designed to reduce dropout rates and improve learning outcomes across Rwanda. The platform serves students, teachers, and donors through personalized dashboards and data-driven insights.


##  Table of Contents

- [Features]
- [Tech Stack]
- [Project Structure]
- [API Documentation]
- [Deployment]
- [Troubleshooting]
- [License]

##  Features

### For Students
-  Interest-based quiz system for personalized learning recommendations
-  Progress tracking and performance analytics
-  Personalized learning paths based on quiz results

### For Teachers
-  Gamified professional development system with points and levels
-  Student feedback submission and tracking
-  Student management dashboard
-  Achievement tracking and rewards

### For Administrators
-  Comprehensive analytics and statistics
-  User management (students, teachers, admins)
-  At-risk student identification
-  Platform-wide performance metrics

### For Donors
-  Easy donation form integration
-  Connect with students and families in need
-  Transparent contribution tracking

##  Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Components:** Shadcn/ui (Radix UI)
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router v6
- **Form Handling:** React Hook Form + Zod validation
- **Notifications:** Sonner (toast notifications)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** SQLite (development) / PostgreSQL (production ready)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** Zod
- **CORS:** Enabled for frontend communication


### Accessing the Application


Once both servers are running:


1. **Open your browser** (Chrome, Firefox, Edge, or Safari)
2. **Navigate to:** `http://localhost:8080`
3. **You should see:** The INZOZI homepage with the logo and login options


##  First-Time Usage

### Create Your First Account

1. Click **"Get Started"** or **"Login"** on the homepage
2. Switch to the **"Sign Up"** tab
3. Fill in the registration form:
   - **Name:** Your full name
   - **Email:** Your email address
   - **Password:** Choose a strong password (min 6 characters)
   - **Confirm Password:** Re-enter your password
   - **Role:** Select one of:
     - `Student` - For students taking quizzes and tracking progress
     - `Teacher` - For teachers providing feedback and earning points
     - `Admin` - For administrators managing the platform
4. Click **"Sign Up"**

### Login

1. Go to the **"Login"** tab
2. Enter your **email** and **password**
3. Click **"Login"**
4. You'll be redirected to your role-specific dashboard


##  Project Structure

```
Inzozi_Rwanda/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── lib/
│   │   │   └── db.ts          # Database connection
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts  # JWT authentication
│   │   ├── routes/
│   │   │   ├── auth.routes.ts      # Authentication routes
│   │   │   ├── student.routes.ts   # Student endpoints
│   │   │   ├── teacher.routes.ts   # Teacher endpoints
│   │   │   └── admin.routes.ts     # Admin endpoints
│   │   └── utils/
│   │       ├── auth.utils.ts       # Auth helpers
│   │       └── id.utils.ts         # ID generation
│   ├── dev.db                 # SQLite database (auto-generated)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                   # Environment variables
│
├── frontend/                  # Frontend React application
│   ├── public/
│   │   ├── inzozi-logo.png   # App logo
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Shadcn/ui components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── NavLink.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Index.tsx    # Homepage
│   │   │   ├── Auth.tsx     # Login/Signup
│   │   │   ├── About.tsx    # About page
│   │   │   └── dashboards/  # Role-specific dashboards
│   │   │       ├── StudentDashboard.tsx
│   │   │       ├── TeacherDashboard.tsx
│   │   │       └── AdminDashboard.tsx
│   │   ├── lib/
│   │   │   ├── api.ts       # API client
│   │   │   └── utils.ts     # Utility functions
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── .env                 # Environment variables
│
├── render.yaml              # Render.com deployment config
└── README.md                # This file
```
##  API Documentation

### Base URL

```
Local Development: http://localhost:5000
Production: https://your-backend-url.com
```

###live applicatio link:https://inzozi-rwanda.onrender.com/

### Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```
### Example Request

```javascript
// Login Example
const response = await fetch('http://localhost:5000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});


const data = await response.json();
console.log(data.token); // JWT token
console.log(data.user);  // User object
```

## Deployment

### Backend Deployment (Render.com)

1. **Create a Render account** at [render.com](https://render.com)
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add all variables from `.env`

### Frontend Deployment (Render.com )

#### Option 1: Render.com

1. **Create a new Static Site**
2. **Configure:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. **Add environment variables:**
   - `VITE_API_URL`: Your backend URL
   - `VITE_BACKEND_URL`: Your backend URL

### Post-Deployment

1. Update `frontend/.env` with production backend URL
2. Update `backend/.env` `CORS_ORIGIN` with production frontend URL
3. Test all features in production environment

##  Troubleshooting

### "Failed to fetch" Error

**Problem:** Frontend can't connect to backend

**Solution:**
1. Verify backend is running: `cd backend && npm run dev`
2. Check `frontend/.env` has correct `VITE_API_URL`
3. Verify backend shows: "INZOZI API Server running on http://localhost:5000"
4. Check browser console for CORS errors

### Backend Won't Start

**Problem:** Error when running `npm run dev` in backend

**Solution:**
1. Delete `node_modules`: `rm -rf node_modules` (or `rmdir /s node_modules` on Windows)
2. Delete `package-lock.json`
3. Reinstall: `npm install`
4. Check `.env` file exists and is configured correctly
5. Verify Node.js version: `node --version` (should be 18+)

### Frontend Won't Start

**Problem:** Error when running `npm run dev` in frontend

**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Reinstall: `npm install`
3. Check `.env` file exists
4. Clear Vite cache: `rm -rf node_modules/.vite`

### Database Errors

**Problem:** "Table not found" or database errors

**Solution:**
1. Stop backend server (Ctrl+C)
2. Delete `backend/dev.db`
3. Restart backend: `npm run dev`
4. Database will auto-recreate with tables

### Port Already in Use

**Problem:** "Port 5000 is already in use"

**Solution:**

**Windows:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

Or change the port in `backend/.env`:
```env
PORT=5001
```
### "Cannot find module" Errors

**Problem:** Import errors or missing modules

**Solution:**
1. Make sure you're in the correct directory (backend or frontend)
2. Run `npm install` again
3. Check `tsconfig.json` configuration
4. Restart your terminal/IDE

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Authors

- **Claudia Adeline** - [@iclaudiaadeline](https://github.com/iclaudiaadeline)

##  Acknowledgments

- Built with love for Rwanda's education system
- Inspired by the need to reduce dropout rates and improve learning outcomes
- Thanks to all contributors and supporters of education technology in Rwanda

---
**Made with love in Rwanda | INZOZI - Empowering Education Through Technology**



