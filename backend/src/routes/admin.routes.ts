import express from 'express';
import db from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await db.get('SELECT COUNT(*) as count FROM User') as any;
    const students = await db.get('SELECT COUNT(*) as count FROM User WHERE role = ?', ['student']) as any;
    const teachers = await db.get('SELECT COUNT(*) as count FROM User WHERE role = ?', ['teacher']) as any;
    const totalDonations = await db.get('SELECT COUNT(*) as count FROM DonorSubmission') as any;
    const atRiskStudents = await db.get(
      'SELECT COUNT(*) as count FROM StudentProfile WHERE attendance < 75 OR performance = ?',
      ['Needs Improvement']
    ) as any;

    res.json({
      totalUsers: totalUsers?.count || 0,
      students: students?.count || 0,
      teachers: teachers?.count || 0,
      totalDonations: totalDonations?.count || 0,
      activeCases: atRiskStudents?.count || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users by role
router.get('/users/role-distribution', async (req, res) => {
  try {
    const students = await db.get('SELECT COUNT(*) as count FROM User WHERE role = ?', ['student']) as any;
    const teachers = await db.get('SELECT COUNT(*) as count FROM User WHERE role = ?', ['teacher']) as any;
    const admins = await db.get('SELECT COUNT(*) as count FROM User WHERE role = ?', ['admin']) as any;

    const studentCount = students?.count || 0;
    const teacherCount = teachers?.count || 0;
    const adminCount = admins?.count || 0;
    const total = studentCount + teacherCount + adminCount;

    res.json({
      students: {
        count: studentCount,
        percentage: total > 0 ? ((studentCount / total) * 100).toFixed(1) : '0'
      },
      teachers: {
        count: teacherCount,
        percentage: total > 0 ? ((teacherCount / total) * 100).toFixed(1) : '0'
      },
      admins: {
        count: adminCount,
        percentage: total > 0 ? ((adminCount / total) * 100).toFixed(1) : '0'
      }
    });
  } catch (error) {
    console.error('Get role distribution error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get at-risk students
router.get('/students/at-risk', async (req, res) => {
  try {
    const atRiskStudents = await db.all(
      `SELECT sp.*, u.name, u.email FROM StudentProfile sp 
       JOIN User u ON sp.userId = u.id
       WHERE sp.attendance < 75 OR sp.performance = ?
       ORDER BY sp.attendance ASC
       LIMIT 10`,
      ['Needs Improvement']
    );

    res.json({
      students: atRiskStudents.map((profile: any) => ({
        name: profile.name,
        grade: profile.grade || 'N/A',
        attendance: `${profile.attendance}%`,
        performance: profile.performance,
        severity: profile.attendance < 75 ? 'high' : 'medium'
      }))
    });
  } catch (error) {
    console.error('Get at-risk students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get donor submissions
router.get('/donors/submissions', async (req, res) => {
  try {
    const submissions = await db.all(
      'SELECT * FROM DonorSubmission ORDER BY submittedAt DESC LIMIT 50'
    );

    res.json({ submissions });
  } catch (error) {
    console.error('Get donor submissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


