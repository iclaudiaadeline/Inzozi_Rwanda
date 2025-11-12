# 🚀 QUICK START - 3 STEPS

## Step 1️⃣: Start Backend Server

```
Open Terminal 1:

cd backend
npm run dev

Wait for this message:
✅ Connected to SQLite database
✅ Database tables initialized
🚀 Server running on http://localhost:5000
```

## Step 2️⃣: Start Frontend Server

```
Open Terminal 2:

npm run dev

Wait for this message:
➜  Local:   http://localhost:8080/
```

## Step 3️⃣: Test in Browser

```
1. Open: http://localhost:8080
2. Click: "Student" button
3. Click: "Sign up" link
4. Fill form:
   - Name: Test User
   - Email: test@test.com
   - Password: password123
   - Role: Student
5. Click: "Sign up" button
6. Should see: Success! Redirected to dashboard
```

---

## ✅ If It Works

You'll see:
- ✅ Home page loads
- ✅ Student/Teacher/Admin buttons visible
- ✅ Signup form works
- ✅ New account created
- ✅ Dashboard shows user data
- ✅ Login works with same credentials

---

## ❌ If It Doesn't Work

### "Cannot GET /"
- Make sure you're on http://localhost:8080
- NOT on http://localhost:5000
- Frontend must be running (Terminal 2)

### "Signup failed"
- Check backend terminal for error messages
- Press F12 in browser, click Console tab
- Look for error details

### "Cannot connect"
- Backend must be running (Terminal 1)
- Check Terminal 1 shows "Server running on http://localhost:5000"

### "Port already in use"
- Stop the other process (Ctrl+C)
- Or change PORT in backend/.env

---

## 🎯 That's It!

Once signup works, you can:
- ✅ Login with the account you created
- ✅ View your dashboard
- ✅ Submit quizzes (students)
- ✅ Give feedback (teachers)
- ✅ View stats (admins)

---

## 📋 Files to Remember

- **Frontend files**: `src/` folder
- **Backend files**: `backend/src/` folder
- **Database**: `backend/dev.db`
- **Docs**: `COMPLETE_FIX_READY.md` ← Read this for details!

---

**Done! Your app is ready to use! 🎉**
