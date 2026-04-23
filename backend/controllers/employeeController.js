const Employee = require('../models/Employee');
const User = require('../models/User');

// Generate employee ID
const generateEmployeeId = async () => {
  const count = await Employee.countDocuments();
  return `EMP${String(count + 1).padStart(4, '0')}`;
};

// @desc   Get all employees
// @route  GET /api/employees
exports.getEmployees = async (req, res) => {
  try {
    const { department, status, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (department) query.department = department;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (page - 1) * limit;
    const [employees, total] = await Promise.all([
      Employee.find(query).populate('user', 'name email avatar role').populate('manager', 'firstName lastName').skip(skip).limit(Number(limit)).sort('-createdAt'),
      Employee.countDocuments(query)
    ]);
    res.json({ success: true, count: employees.length, total, pages: Math.ceil(total / limit), employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get single employee
// @route  GET /api/employees/:id
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('user', 'name email avatar role lastLogin')
      .populate('manager', 'firstName lastName designation');
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Create employee
// @route  POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();
    const employee = await Employee.create({ ...req.body, employeeId });
    res.status(201).json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Update employee
// @route  PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Delete employee
// @route  DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    // Deactivate linked user instead of hard delete
    await User.findByIdAndUpdate(employee.user, { isActive: false });
    employee.status = 'terminated';
    await employee.save();
    res.json({ success: true, message: 'Employee terminated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Upload document
// @route  POST /api/employees/:id/documents
exports.uploadDocument = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    employee.documents.push({ name: req.body.name || req.file.originalname, url: `/uploads/documents/${req.file.filename}` });
    await employee.save();
    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get departments list
// @route  GET /api/employees/departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Employee.distinct('department');
    res.json({ success: true, departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
