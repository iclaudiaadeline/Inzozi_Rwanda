import express from 'express';
import db from '../lib/db.js';
import { generateId } from '../utils/id.utils.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { z } from 'zod';

const router = express.Router();

// Helper to safely parse interests strings
const safeParseArray = (val: any): string[] => {
  if (Array.isArray(val)) return val as string[];
  if (typeof val !== 'string') return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// All routes require authentication
router.use(authenticate);
router.use(authorize('student', 'admin'));

// Get student profile
router.get('/profile', async (req, res) => {
  try {
    const userId = (req as any).userId;

    const user = await db.get(
      'SELECT * FROM User WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const studentProfile = await db.get(
      'SELECT * FROM StudentProfile WHERE userId = ?',
      [userId]
    );

    if (!studentProfile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Parse interests string to array for response compatibility
    const profile = {
      ...studentProfile,
      interests: safeParseArray(studentProfile.interests)
    };

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit quiz results
const quizResultSchema = z.object({
  interests: z.array(z.string())
});

router.post('/quiz', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const validatedData = quizResultSchema.parse(req.body);
    const { interests } = validatedData;

    const studentProfile = await db.get(
      'SELECT * FROM StudentProfile WHERE userId = ?',
      [userId]
    );

    if (!studentProfile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Save quiz result (store as string)
    const quizResultId = generateId();
    await db.run(
      'INSERT INTO QuizResult (id, studentId, interests) VALUES (?, ?, ?)',
      [quizResultId, studentProfile.id, JSON.stringify(interests)]
    );

    // Update student profile with interests (store as string)
    await db.run(
      'UPDATE StudentProfile SET interests = ? WHERE id = ?',
      [JSON.stringify(interests), studentProfile.id]
    );

    res.json({
      message: 'Quiz results saved successfully',
      quizResult: {
        id: quizResultId,
        studentId: studentProfile.id,
        interests
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz results
router.get('/quiz/results', async (req, res) => {
  try {
    const userId = (req as any).userId;

    const studentProfile = await db.get(
      'SELECT * FROM StudentProfile WHERE userId = ?',
      [userId]
    );

    if (!studentProfile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const latest = await db.get(
      'SELECT * FROM QuizResult WHERE studentId = ? ORDER BY completedAt DESC LIMIT 1',
      [studentProfile.id]
    );

    res.json({
      interests: safeParseArray(studentProfile.interests),
      latestResult: latest ? { ...latest, interests: safeParseArray(latest.interests) } : null
    });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


