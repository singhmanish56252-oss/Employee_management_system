const Employee = require('../models/Employee');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { Attendance, Leave } = require('../models/Attendance');
const Payroll = require('../models/Payroll');
const User = require('../models/User');

// @desc   Admin dashboard stats
// @route  GET /api/dashboard/admin
exports.getAdminDashboard = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [
      totalEmployees, activeEmployees, newHires,
      totalJobs, openJobs, totalApplications,
      pendingLeaves, todayAttendance, totalPayroll,
      departmentStats, applicationTrend, monthlyPayroll
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ status: 'active' }),
      Employee.countDocuments({ joiningDate: { $gte: new Date(year, month - 1, 1) } }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'open' }),
      Application.countDocuments(),
      Leave.countDocuments({ status: 'pending' }),
      Attendance.countDocuments({
        date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) },
        status: 'present'
      }),
      Payroll.aggregate([{ $group: { _id: null, total: { $sum: '$netSalary' } } }]),
      Employee.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Application.aggregate([
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }, { $limit: 6 }
      ]),
      Payroll.aggregate([
        { $match: { year: { $gte: year - 1 } } },
        { $group: { _id: { month: '$month', year: '$year' }, total: { $sum: '$netSalary' } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }, { $limit: 12 }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalEmployees, activeEmployees, newHires,
        totalJobs, openJobs, totalApplications,
        pendingLeaves, todayAttendance,
        totalPayroll: totalPayroll[0]?.total || 0
      },
      charts: { departmentStats, applicationTrend, monthlyPayroll }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   HR dashboard
// @route  GET /api/dashboard/hr
exports.getHRDashboard = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [openJobs, newApplications, pendingLeaves, recentApplications, totalEmployees, newHires] = await Promise.all([
      Job.countDocuments({ status: 'open' }),
      Application.countDocuments({ status: 'pending' }),
      Leave.countDocuments({ status: 'pending' }),
      Application.find().populate('job', 'title').sort('-createdAt').limit(5),
      Employee.countDocuments(),
      Employee.countDocuments({ joiningDate: { $gte: new Date(year, month - 1, 1) } })
    ]);
    res.json({ success: true, stats: { openJobs, newApplications, pendingLeaves, totalEmployees, newHires }, recentApplications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Employee dashboard
// @route  GET /api/dashboard/employee
exports.getEmployeeDashboard = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee profile not found' });

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [attendance, leaves, payroll] = await Promise.all([
      Attendance.find({
        employee: employee._id,
        date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) }
      }),
      Leave.find({ employee: employee._id }).sort('-createdAt').limit(5),
      Payroll.find({ employee: employee._id }).sort({ year: -1, month: -1 }).limit(3)
    ]);

    const presentDays = attendance.filter(a => a.status === 'present').length;
    const totalHours = attendance.reduce((sum, a) => sum + a.workHours, 0);

    res.json({
      success: true,
      employee,
      stats: { presentDays, totalHours: parseFloat(totalHours.toFixed(1)), pendingLeaves: leaves.filter(l => l.status === 'pending').length },
      recentLeaves: leaves,
      recentPayroll: payroll
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
