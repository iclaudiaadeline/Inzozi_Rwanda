import express from 'express';
import db from '../lib/db.js';
import { generateId } from '../utils/id.utils.js';
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

    const user = await db.get(
      'SELECT * FROM User WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }

    const teacherProfile = await db.get(
      'SELECT * FROM TeacherProfile WHERE userId = ?',
      [userId]
    );

    if (!teacherProfile) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }

    const achievements = await db.all(
      'SELECT * FROM Achievement WHERE teacherId = ? ORDER BY earnedAt DESC',
      [teacherProfile.id]
    );

    const students = await db.all(
      'SELECT * FROM StudentFeedback WHERE teacherId = ? ORDER BY createdAt DESC LIMIT 10',
      [teacherProfile.id]
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      profile: {
        ...teacherProfile,
        achievements,
        students,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit student feedback
const feedbackSchema = z.object({
  studentName: z.string().min(1),
  performance: z.string().min(1, 'Performance rating is required'),
  feedback: z.string().min(10),
});

router.post('/feedback', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const validatedData = feedbackSchema.parse(req.body);

    const teacherProfile = await db.get(
      'SELECT * FROM TeacherProfile WHERE userId = ?',
      [userId]
    );

    if (!teacherProfile) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }

    // Create feedback
    const feedbackId = generateId();
    await db.run(
      'INSERT INTO StudentFeedback (id, teacherId, studentName, performance, feedback) VALUES (?, ?, ?, ?, ?)',
      [feedbackId, teacherProfile.id, validatedData.studentName, validatedData.performance, validatedData.feedback]
    );

    // Award points (30 points per feedback)
    const pointsEarned = 30;
    const newPoints = teacherProfile.points + pointsEarned;
    const newLevel = Math.floor(newPoints / 500) + 1;

    await db.run(
      'UPDATE TeacherProfile SET points = ?, level = ? WHERE id = ?',
      [newPoints, newLevel, teacherProfile.id]
    );

    res.json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: feedbackId,
        teacherId: teacherProfile.id,
        studentName: validatedData.studentName,
        performance: validatedData.performance,
        feedback: validatedData.feedback,
      },
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
    const results = await db.all(
      'SELECT qr.*, sp.userId FROM QuizResult qr JOIN StudentProfile sp ON qr.studentId = sp.id ORDER BY qr.completedAt DESC LIMIT 20',
      []
    );

    const summaries = results.map((r: any) => ({
      studentId: r.userId,
      studentName: 'Student', // We'd need to join User table for full name
      interests: ((): string[] => {
        try {
          return Array.isArray(r.interests) ? r.interests : JSON.parse(r.interests);
        } catch {
          return [];
        }
      })(),
      completedAt: r.completedAt,
    }));

    res.json({ summaries });
  } catch (error) {
    console.error('Get quiz summaries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
