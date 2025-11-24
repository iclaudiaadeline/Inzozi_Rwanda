import express from 'express';
import db from '../lib/db.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils.js';
import { generateId } from '../utils/id.utils.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['student', 'teacher', 'admin'])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { name, email, password, role } = validatedData;

    // Check if user already exists
    const existingUser = await db.get(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = generateId();
    await db.run(
      'INSERT INTO User (id, email, name, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, email, name, hashedPassword, role]
    );

    // Create user profile based on role
    if (role === 'student') {
      const profileId = generateId();
      await db.run(
        'INSERT INTO StudentProfile (id, userId, attendance, performance, interests) VALUES (?, ?, ?, ?, ?)',
        [profileId, userId, 85, 'Good', JSON.stringify([])]
      );
    } else if (role === 'teacher') {
      const profileId = generateId();
      await db.run(
        'INSERT INTO TeacherProfile (id, userId, points, level) VALUES (?, ?, ?, ?)',
        [profileId, userId, 0, 1]
      );
    }

    // Generate token
    const token = generateToken(userId, role);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: userId,
        name,
        email,
        role
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Signup error (maybe database):', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user
    const user = await db.get(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;

    const user = await db.get(
      'SELECT id, name, email, role FROM User WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


