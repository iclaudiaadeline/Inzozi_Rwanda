# Troubleshooting "Failed to fetch" Error

## What This Error Means

"Failed to fetch" typically indicates that the frontend cannot connect to the backend API. This is usually a **network connectivity issue**, not a code bug.

## Common Causes & Solutions

### 1. ❌ Backend Not Running

**Symptom**: You see "Failed to fetch" immediately when trying to login

**Solution**:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Wait for this output:
# 🚀 Server running on http://localhost:5000
# ✅ Connected to SQLite database
```

### 2. ❌ Wrong API URL

**Symptom**: Backend is running but still getting "Failed to fetch"

**Solution**: 
- Check `VITE_API_URL` in `.env` file
- Must be: `VITE_API_URL=http://localhost:5000/api`
- **Important**: Restart frontend dev server after changing `.env`

### 3. ❌ CORS Configuration Mismatch

**Symptom**: Browser console shows CORS error

**Solution**:
1. Check backend `.env` file:
   ```env
   CORS_ORIGIN="http://localhost:5173"
   ```
2. Check that frontend is running on port 5173 or 8080 (update CORS_ORIGIN if different)
3. Restart backend server after changing `.env`

### 4. ❌ Ports Already In Use

**Symptom**: Backend fails to start or shows port error

**Solution**:
```bash
# Find what's using the port
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Then either:
# Option A: Kill the process
taskkill /PID <PID> /F  # Windows

# Option B: Change port in backend/.env
PORT=5001
# And update frontend/.env
VITE_API_URL=http://localhost:5001/api
```

### 5. ❌ Database Not Initialized

**Symptom**: Login fails with server error

**Solution**:
```bash
# The database should auto-create, but if not:
cd backend
rm dev.db dev.db-journal  # Delete old database
npm run dev              # Restart backend
```

## Step-by-Step Debugging

### Step 1: Verify Backend is Running
```bash
cd backend
npm run dev
```

Check terminal for:
- ✅ "🚀 Server running on http://localhost:5000"
- ✅ "✅ Connected to SQLite database"

### Step 2: Verify Frontend Configuration
```bash
# Check frontend/.env
cat .env
# Should show: VITE_API_URL=http://localhost:5000/api
```

### Step 3: Test Direct API Call
Open a new terminal and test:
```bash
# PowerShell on Windows:
Invoke-WebRequest -Uri http://localhost:5000/api/health -Method GET

# Should return similar response (may vary):
# StatusCode        : 200
# StatusDescription : OK
```

### Step 4: Check Browser Console
1. Open browser (http://localhost:8080)
2. Press F12 to open Developer Tools
3. Click "Console" tab
4. Try to login
5. Look for error messages with details

### Step 5: Check Network Tab
1. Press F12 → Network tab
2. Try to login
3. Look for the request to `http://localhost:5000/api/auth/login`
4. Check:
   - **Status**: Should be 200 (success) or 401 (wrong password)
   - **Response**: Should show actual error message
   - **Headers**: Check if Authorization header is present

## Example Error Scenarios

### Error: ERR_NETWORK
```
Failed to fetch
TypeError: Failed to fetch
  at async request (api.ts:30)
```
**Cause**: Backend not running or wrong port
**Fix**: `cd backend && npm run dev`

### Error: CORS policy
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' 
from origin 'http://localhost:8080' has been blocked by CORS policy
```
**Cause**: CORS_ORIGIN mismatch
**Fix**: Update `CORS_ORIGIN` in `backend/.env` to match frontend port

### Error: Connection refused
```
TypeError: Failed to fetch
  caused by: Error: connect ECONNREFUSED 127.0.0.1:5000
```
**Cause**: Backend not running
**Fix**: Start backend server

## Quick Checklist

- [ ] Backend running? (`npm run dev` in backend folder)
- [ ] Frontend .env has correct API URL?
- [ ] Backend .env has correct CORS_ORIGIN?
- [ ] Port 5000 not in use by another process?
- [ ] Frontend restarted after .env changes?
- [ ] Database file created at `backend/dev.db`?
- [ ] Browser console shows detailed error?
- [ ] Network tab shows the request attempt?

## Files to Check

1. **Backend Configuration**
   - `backend/.env` - DATABASE_URL, PORT, CORS_ORIGIN, JWT_SECRET
   - `backend/package.json` - Dependencies (sqlite3 installed?)

2. **Frontend Configuration**
   - `.env` - VITE_API_URL must point to backend

3. **Database**
   - `backend/dev.db` - Should exist after first run
   - If missing, delete and restart backend

## Last Resort: Full Reset

```bash
# 1. Stop both servers (Ctrl+C in both terminals)

# 2. Clean backend
cd backend
rm -r node_modules dev.db dev.db-journal
npm install
npm run build  # Verify compilation

# 3. Clean frontend
cd ..
rm -r node_modules
npm install

# 4. Start fresh
# Terminal 1
cd backend
npm run dev

# Terminal 2
npm run dev
```

## Getting Detailed Logs

### Enable Debugging in Frontend
Edit `src/lib/api.ts`:
```typescript
// Already added - check console for detailed errors
console.error(`API Error at ${url}:`, error);
```

### Backend Logs
The backend automatically logs errors to terminal. Check for:
```
[ERROR] Login error: ...
[ERROR] Signup error: ...
[ERROR] Database error: ...
```

---

## Still Not Working?

1. **Take a screenshot** of:
   - Backend terminal output
   - Browser console errors
   - Network tab requests/responses

2. **Check**: Are both backend AND frontend running?

3. **Verify**: Is the .env file in the correct location?
   - Backend: `backend/.env`
   - Frontend: `.env` (root folder)

4. **Try**: Clear all browsers cache (Ctrl+Shift+Delete)

---

**Most "Failed to fetch" errors are solved by simply restarting both servers or checking the .env file!**
