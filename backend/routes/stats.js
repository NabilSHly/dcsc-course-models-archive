const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();

// Get dashboard statistics
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    // Get total courses
    const totalCourses = await prisma.course.count();

    // Get total graduates
    const graduatesResult = await prisma.course.aggregate({
      _sum: {
        numberOfGraduates: true
      }
    });

    // Get total hours
    const hoursResult = await prisma.course.aggregate({
      _sum: {
        courseHours: true
      }
    });

    // Get total beneficiaries
    const beneficiariesResult = await prisma.course.aggregate({
      _sum: {
        numberOfBeneficiaries: true
      }
    });

    // Get courses by field
    const coursesByField = await prisma.courseField.findMany({
      include: {
        _count: {
          select: { courses: true }
        }
      },
      orderBy: {
        courses: {
          _count: 'desc'
        }
      }
    });

    // Get recent courses
    const recentCourses = await prisma.course.findMany({
      take: 5,
      orderBy: {
        courseStartDate: 'desc'
      },
      select: {
        id: true,
        courseNumber: true,
        courseName: true,
        courseField: {
          select: {
            id: true,
            name: true
          }
        },
        courseStartDate: true,
        courseEndDate: true,
        numberOfGraduates: true
      }
    });

    // Get courses by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const coursesByMonth = await prisma.$queryRaw`
      SELECT 
        TO_CHAR("courseStartDate", 'YYYY-MM') as month,
        COUNT(*) as count,
        SUM("numberOfGraduates") as graduates
      FROM "Course"
      WHERE "courseStartDate" >= ${sixMonthsAgo}
      GROUP BY TO_CHAR("courseStartDate", 'YYYY-MM')
      ORDER BY month DESC
    `;

    res.json({
      success: true,
      data: {
        overview: {
          totalCourses,
          totalGraduates: graduatesResult._sum.numberOfGraduates || 0,
          totalHours: hoursResult._sum.courseHours || 0,
          totalBeneficiaries: beneficiariesResult._sum.numberOfBeneficiaries || 0
        },
        coursesByField: coursesByField.map(item => ({
          id: item.id,
          name: item.name,
          count: item._count.courses
        })),
        recentCourses,
        coursesByMonth
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

// Get field statistics
router.get('/fields', authMiddleware, async (req, res) => {
  try {
    const fieldStats = await prisma.courseField.findMany({
      include: {
        _count: {
          select: { courses: true }
        },
        courses: {
          select: {
            numberOfGraduates: true,
            numberOfBeneficiaries: true,
            courseHours: true
          }
        }
      },
      orderBy: {
        courses: {
          _count: 'desc'
        }
      }
    });

    res.json({
      success: true,
      data: fieldStats.map(field => ({
        id: field.id,
        name: field.name,
        totalCourses: field._count.courses,
        totalGraduates: field.courses.reduce((sum, c) => sum + c.numberOfGraduates, 0),
        totalBeneficiaries: field.courses.reduce((sum, c) => sum + c.numberOfBeneficiaries, 0),
        totalHours: field.courses.reduce((sum, c) => sum + c.courseHours, 0)
      }))
    });

  } catch (error) {
    console.error('Get field stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching field statistics'
    });
  }
});

// Get trainer statistics
router.get('/trainers', authMiddleware, async (req, res) => {
  try {
    const trainerStats = await prisma.course.groupBy({
      by: ['trainerName', 'trainerPhoneNumber'],
      _count: {
        trainerName: true
      },
      _sum: {
        numberOfGraduates: true,
        courseHours: true
      },
      orderBy: {
        _count: {
          trainerName: 'desc'
        }
      }
    });

    res.json({
      success: true,
      data: trainerStats.map(item => ({
        name: item.trainerName,
        phone: item.trainerPhoneNumber,
        totalCourses: item._count.trainerName,
        totalGraduates: item._sum.numberOfGraduates || 0,
        totalHours: item._sum.courseHours || 0
      }))
    });

  } catch (error) {
    console.error('Get trainer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trainer statistics'
    });
  }
});

// Get yearly statistics
router.get('/yearly/:year?', authMiddleware, async (req, res) => {
  try {
    const year = req.params.year || new Date().getFullYear();
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const yearlyStats = await prisma.course.aggregate({
      where: {
        courseStartDate: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        id: true
      },
      _sum: {
        numberOfGraduates: true,
        numberOfBeneficiaries: true,
        courseHours: true
      }
    });

    const monthlyBreakdown = await prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "courseStartDate") as month,
        COUNT(*) as courses,
        SUM("numberOfGraduates") as graduates,
        SUM("courseHours") as hours
      FROM "Course"
      WHERE "courseStartDate" >= ${startDate} AND "courseStartDate" <= ${endDate}
      GROUP BY EXTRACT(MONTH FROM "courseStartDate")
      ORDER BY month
    `;

    res.json({
      success: true,
      data: {
        year: parseInt(year),
        overview: {
          totalCourses: yearlyStats._count.id,
          totalGraduates: yearlyStats._sum.numberOfGraduates || 0,
          totalBeneficiaries: yearlyStats._sum.numberOfBeneficiaries || 0,
          totalHours: yearlyStats._sum.courseHours || 0
        },
        monthlyBreakdown
      }
    });

  } catch (error) {
    console.error('Get yearly stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching yearly statistics'
    });
  }
});

module.exports = router;