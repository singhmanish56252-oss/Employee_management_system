const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { Attendance } = require('../models/Attendance');

// @desc   Process payroll for a month
// @route  POST /api/payroll/process
exports.processPayroll = async (req, res) => {
  try {
    const { month, year } = req.body;
    const employees = await Employee.find({ status: 'active' });
    const results = [];

    for (const emp of employees) {
      const exists = await Payroll.findOne({ employee: emp._id, month, year });
      if (exists) continue;

      // Count attendance days
      const attendanceRecords = await Attendance.find({
        employee: emp._id,
        date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) }
      });
      const daysWorked = attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length;
      const totalOvertime = attendanceRecords.reduce((sum, r) => sum + r.overtime, 0);

      // Salary structure
      const basicSalary = emp.salary;
      const hra = basicSalary * 0.4;
      const allowances = basicSalary * 0.1;
      const overtimePay = totalOvertime * (basicSalary / (22 * 8));
      const taxDeduction = basicSalary > 50000 ? basicSalary * 0.1 : 0;
      const pfDeduction = basicSalary * 0.12;
      const epsSalary = Math.min(basicSalary, 15000);
      const employerEPS = epsSalary * 0.0833;
      const employerEPF = pfDeduction - employerEPS;

      const payroll = await Payroll.create({
        employee: emp._id, month, year, basicSalary, hra, allowances,
        overtimePay: parseFloat(overtimePay.toFixed(2)),
        taxDeduction: parseFloat(taxDeduction.toFixed(2)),
        pfDeduction: parseFloat(pfDeduction.toFixed(2)),
        employerEPF: parseFloat(employerEPF.toFixed(2)),
        employerEPS: parseFloat(employerEPS.toFixed(2)),
        daysWorked, processedBy: req.user._id
      });
      results.push(payroll);
    }
    res.status(201).json({ success: true, message: `Processed ${results.length} payrolls`, count: results.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get payroll records
// @route  GET /api/payroll
exports.getPayroll = async (req, res) => {
  try {
    const { employee, month, year, status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (employee) query.employee = employee;
    if (month) query.month = month;
    if (year) query.year = year;
    if (status) query.status = status;
    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      Payroll.find(query).populate('employee', 'firstName lastName employeeId department designation').sort({ year: -1, month: -1 }).skip(skip).limit(Number(limit)),
      Payroll.countDocuments(query)
    ]);
    res.json({ success: true, count: records.length, total, pages: Math.ceil(total / limit), records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get single payslip
// @route  GET /api/payroll/:id
exports.getPayslip = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate('employee', 'firstName lastName employeeId department designation bankDetails');
    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll record not found' });
    res.json({ success: true, payroll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Mark payroll as paid
// @route  PUT /api/payroll/:id/pay
exports.markPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(req.params.id, { status: 'paid', paidOn: new Date() }, { new: true });
    if (!payroll) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, payroll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Update payroll (add bonus / deductions)
// @route  PUT /api/payroll/:id
exports.updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!payroll) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, payroll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
