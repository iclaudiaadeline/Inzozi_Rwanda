import express from 'express';
import prisma from '../lib/prisma.js';
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true
      }
    });

    if (!user || !user.studentProfile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Parse interests string to array for response compatibility
    const profile = {
      ...user.studentProfile,
      interests: safeParseArray(user.studentProfile.interests)
    } as any;

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    });

    if (!user || !user.studentProfile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Save quiz result (store as string)
    const quizResult = await prisma.quizResult.create({
      data: {
        studentId: user.studentProfile.id,
        interests: JSON.stringify(interests)
      }
    });

    // Update student profile with interests (store as string)
    await prisma.studentProfile.update({
      where: { id: user.studentProfile.id },
      data: {
        interests: JSON.stringify(interests)
      }
    });

    res.json({
      message: 'Quiz results saved successfully',
      quizResult: {
        ...quizResult,
        interests // echo array back to client
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            quizResults: {
              orderBy: {
                completedAt: 'desc'
              },
              take: 1
            }
          }
        }
      }
    });

    if (!user || !user.studentProfile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const latest = user.studentProfile.quizResults[0] || null;

    res.json({
      interests: safeParseArray(user.studentProfile.interests),
      latestResult: latest ? { ...latest, interests: safeParseArray((latest as any).interests) } : null
    });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


