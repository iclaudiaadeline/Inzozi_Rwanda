import express from 'express';
import prisma from '../lib/prisma.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils.js';
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
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const created = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        ...(role === 'student' && {
          studentProfile: {
            create: {
              attendance: 85,
              performance: 'Good',
              interests: JSON.stringify([])
            }
          }
        }),
        ...(role === 'teacher' && {
          teacherProfile: {
            create: {
              points: 0,
              level: 1
            }
          }
        })
      }
    });

    // Normalize user for response (hide password)
    const user = {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role
    };

    // Generate token
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

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


