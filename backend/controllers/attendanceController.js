const { Attendance, Leave } = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc   Mark attendance
// @route  POST /api/attendance
exports.markAttendance = async (req, res) => {
  try {
    const { employee, date, checkIn, checkOut, status, notes } = req.body;
    const existing = await Attendance.findOne({
      employee,
      date: { $gte: new Date(date).setHours(0,0,0,0), $lt: new Date(date).setHours(23,59,59,999) }
    });
    if (existing) return res.status(400).json({ success: false, message: 'Attendance already marked for this date' });

    let workHours = 0;
    if (checkIn && checkOut) {
      workHours = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60);
    }
    const overtime = workHours > 8 ? workHours - 8 : 0;

    const record = await Attendance.create({ employee, date, checkIn, checkOut, status, notes, workHours: parseFloat(workHours.toFixed(2)), overtime: parseFloat(overtime.toFixed(2)), markedBy: req.user._id });
    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get attendance records
// @route  GET /api/attendance
exports.getAttendance = async (req, res) => {
  try {
    const { employee, month, year, page = 1, limit = 31 } = req.query;
    const query = {};
    if (employee) query.employee = employee;
    if (month && year) {
      query.date = {
        $gte: new Date(year, month - 1, 1),
        $lt:  new Date(year, month, 1)
      };
    }
    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      Attendance.find(query).populate('employee', 'firstName lastName employeeId').sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Attendance.countDocuments(query)
    ]);
    res.json({ success: true, count: records.length, total, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Update attendance
// @route  PUT /api/attendance/:id
exports.updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── LEAVES ─────────────────────────────────────────────

// @desc   Apply for leave
// @route  POST /api/attendance/leave
exports.applyLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get leaves
// @route  GET /api/attendance/leaves
exports.getLeaves = async (req, res) => {
  try {
    const { employee, status } = req.query;
    const query = {};
    if (employee) query.employee = employee;
    if (status) query.status = status;
    const leaves = await Leave.find(query).populate('employee', 'firstName lastName employeeId department').populate('approvedBy', 'name').sort('-createdAt');
    res.json({ success: true, count: leaves.length, leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Approve / Reject leave
// @route  PUT /api/attendance/leave/:id
exports.updateLeave = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    leave.status = status;
    leave.remarks = remarks;
    leave.approvedBy = req.user._id;
    await leave.save();
    res.json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
