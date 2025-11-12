# INZOZI Backend API

Backend API server for the INZOZI education platform built with Express.js, TypeScript, and Prisma.

## Features

- 🔐 JWT-based authentication
- 👥 User management (Student, Teacher, Admin roles)
- 📊 Student profile and quiz system
- 🎓 Teacher gamification system
- 📈 Admin dashboard statistics
- 🗄️ SQLite database (easily switchable to PostgreSQL)

## Prerequisites

- Node.js 18+ and npm
- (Optional) PostgreSQL if you want to use it instead of SQLite

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret - Change this to a random string in production
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Port
PORT=5000

# CORS Origin (your frontend URL)
CORS_ORIGIN="http://localhost:5173"

# Node Environment
NODE_ENV="development"
```

**Important:** Generate a secure JWT secret for production:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Database Setup

Generate Prisma client and create the database:

```bash
npm run db:generate
npm run db:push
```

This will create the SQLite database file (`dev.db`) and all necessary tables.

### 4. Run the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your `.env` file).

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

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
- `GET /api/admin/users/role-distribution` - Get user distribution by role
- `GET /api/admin/students/at-risk` - Get at-risk students
- `GET /api/admin/donors/submissions` - Get donor submissions

## Database Management

### View Database in Prisma Studio

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit your database.

### Create Migrations

```bash
npm run db:migrate
```

## Frontend Configuration

Update your frontend `.env` file (or `vite.config.ts`) to point to the backend:

```env
VITE_API_URL=http://localhost:5000/api
```

## Production Deployment

### Using PostgreSQL

1. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/inzozi_db"
```

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Run migrations:
```bash
npm run db:migrate
```

### Environment Variables for Production

- Set a strong `JWT_SECRET`
- Update `CORS_ORIGIN` to your production frontend URL
- Set `NODE_ENV=production`
- Use a secure database connection string

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main server file
│   ├── lib/
│   │   └── prisma.ts         # Prisma client
│   ├── middleware/
│   │   └── auth.middleware.ts # Authentication middleware
│   ├── routes/
│   │   ├── auth.routes.ts    # Authentication routes
│   │   ├── student.routes.ts # Student routes
│   │   ├── teacher.routes.ts # Teacher routes
│   │   └── admin.routes.ts   # Admin routes
│   └── utils/
│       └── auth.utils.ts     # Auth utility functions
├── prisma/
│   └── schema.prisma         # Database schema
├── package.json
└── tsconfig.json
```

## Troubleshooting

### Database Issues

If you encounter database errors:
1. Delete `dev.db` and `dev.db-journal` files
2. Run `npm run db:push` again

### CORS Issues

Make sure `CORS_ORIGIN` in `.env` matches your frontend URL exactly.

### Authentication Issues

- Verify `JWT_SECRET` is set in `.env`
- Check that tokens are being sent in the `Authorization` header: `Bearer <token>`

## Support

For issues or questions, please open an issue on the repository.


