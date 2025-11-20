# INZOZI - Full Stack Setup Guide

This guide will help you set up both the frontend and backend for the INZOZI education platform.

## Quick Start

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
   - Copy `.env` file (already created) or create one with the values from `.env.example`
   - Make sure `JWT_SECRET` is set to a secure random string

4. **Initialize database:**
```bash
npm run db:generate
npm run db:push
```

5. **Start the backend server:**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to project root:**
```bash
cd ..
```

2. **Install dependencies (if not already installed):**
```bash
npm install
```

3. **Configure API URL:**
   - Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Testing the Setup

1. Open `http://localhost:5173` in your browser
2. Click "Get Started" or go to `/auth`
3. Create a new account (Student, Teacher, or Admin)
4. Login and explore the dashboard

## Donor Form Integration

The donor registration form is integrated via Google Forms:
- Link: https://forms.gle/BhC5i88nG4SDJUY79
- The form appears on the homepage as a "Become a Donor" card
- Donor submissions can be viewed in the Admin Dashboard (when implemented)

## API Documentation

See `backend/README.md` for detailed API endpoint documentation.

## Production Deployment

### Backend

1. Update `.env` with production values:
   - Use PostgreSQL instead of SQLite
   - Set a strong `JWT_SECRET`
   - Update `CORS_ORIGIN` to your production frontend URL
   - Set `NODE_ENV=production`

2. Build and run:
```bash
npm run build
npm start
```

### Frontend

1. Update `.env` with production API URL
2. Build:
```bash
npm run build
```

3. Deploy the `dist` folder to your hosting provider

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify `.env` file exists and has correct values
- Run `npm run db:generate` and `npm run db:push`

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend `.env`

### Authentication issues
- Verify JWT_SECRET is set in backend `.env`
- Clear browser localStorage and try logging in again
- Check browser console for error messages

## Next Steps

- [ ] Set up email notifications
- [ ] Integrate payment gateway for donations
- [ ] Add Google Forms webhook to sync donor submissions
- [ ] Implement real-time notifications
- [ ] Add file upload functionality
- [ ] Set up automated backups

## Support

For issues or questions, please refer to the main README or open an issue.


