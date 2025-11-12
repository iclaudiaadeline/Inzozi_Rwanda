import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      students,
      teachers,
      totalDonations,
      atRiskStudents
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: 'teacher' } }),
      prisma.donorSubmission.count(),
      prisma.studentProfile.count({
        where: {
          OR: [
            { attendance: { lt: 75 } },
            { performance: 'Needs Improvement' }
          ]
        }
      })
    ]);

    res.json({
      totalUsers,
      students,
      teachers,
      totalDonations,
      activeCases: atRiskStudents
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users by role
router.get('/users/role-distribution', async (req, res) => {
  try {
    const [students, teachers, admins] = await Promise.all([
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: 'teacher' } }),
      prisma.user.count({ where: { role: 'admin' } })
    ]);

    const total = students + teachers + admins;

    res.json({
      students: {
        count: students,
        percentage: total > 0 ? ((students / total) * 100).toFixed(1) : '0'
      },
      teachers: {
        count: teachers,
        percentage: total > 0 ? ((teachers / total) * 100).toFixed(1) : '0'
      },
      admins: {
        count: admins,
        percentage: total > 0 ? ((admins / total) * 100).toFixed(1) : '0'
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
    const atRiskStudents = await prisma.studentProfile.findMany({
      where: {
        OR: [
          { attendance: { lt: 75 } },
          { performance: 'Needs Improvement' }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      take: 10
    });

    res.json({
      students: atRiskStudents.map(profile => ({
        name: profile.user.name,
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
    const submissions = await prisma.donorSubmission.findMany({
      orderBy: {
        submittedAt: 'desc'
      },
      take: 50
    });

    res.json({ submissions });
  } catch (error) {
    console.error('Get donor submissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


