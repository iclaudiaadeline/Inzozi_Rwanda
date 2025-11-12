import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { z } from 'zod';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(authorize('teacher', 'admin'));

//  Get teacher profile
router.get('/profile', async (req, res) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: {
          include: {
            achievements: {
              orderBy: {
                earnedAt: 'desc',
              },
            },
            students: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 10,
            },
          },
        },
      },
    });

    if (!user || !user.teacherProfile) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      profile: user.teacherProfile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit student feedback
const feedbackSchema = z.object({
  studentName: z.string().min(1),
  performance: z.enum(['Excellent', 'Very Good', 'Good', 'Needs Improvement']),
  feedback: z.string().min(10),
});

router.post('/feedback', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const validatedData = feedbackSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { teacherProfile: true },
    });

    if (!user || !user.teacherProfile) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }

    // Create feedback
    const feedback = await prisma.studentFeedback.create({
      data: {
        teacherId: user.teacherProfile.id,
        studentName: validatedData.studentName,
        performance: validatedData.performance,
        feedback: validatedData.feedback,
      },
    });

    // Award points (30 points per feedback)
    const pointsEarned = 30;
    const newPoints = user.teacherProfile.points + pointsEarned;
    const newLevel = Math.floor(newPoints / 500) + 1;

    await prisma.teacherProfile.update({
      where: { id: user.teacherProfile.id },
      data: {
        points: newPoints,
        level: newLevel,
      },
    });

    res.json({
      message: 'Feedback submitted successfully',
      feedback,
      pointsEarned,
      newPoints,
      newLevel,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//  Get students list (mock data for now)
router.get('/students', async (req, res) => {
  try {
    // In a real app, this would fetch students associated with the teacher
    const students = [
      { id: '1', name: 'Uwase Marie', attendance: '95%', performance: 'Excellent' },
      { id: '2', name: 'Mugabo Jean', attendance: '88%', performance: 'Good' },
      { id: '3', name: 'Umutoniwase Grace', attendance: '92%', performance: 'Very Good' },
      { id: '4', name: 'Ndahiro Patrick', attendance: '78%', performance: 'Needs Improvement' },
    ];

    res.json({ students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//  Recent student quiz summaries (prototype)
router.get('/students/quiz-summaries', async (req, res) => {
  try {
    // Fetch latest quiz results across students (prototype: not tied to a specific teacher)
    const results = await prisma.quizResult.findMany({
      orderBy: { completedAt: 'desc' },
      take: 20,
      include: {
        student: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

const summaries = results.map((r) => ({
  studentId: r.student.user.id,
  studentName: r.student.user.name,
  interests: ((): string[] => { try { return Array.isArray(r.interests) ? (r.interests as any) : JSON.parse((r as any).interests); } catch { return []; } })(),
  completedAt: r.completedAt,
}));

    res.json({ summaries });
  } catch (error) {
    console.error('Get quiz summaries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
