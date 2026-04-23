const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc   Get all jobs
// @route  GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const { status, department, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (department) query.department = department;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } }
    ];
    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      Job.find(query).populate('postedBy', 'name').skip(skip).limit(Number(limit)).sort('-createdAt'),
      Job.countDocuments(query)
    ]);
    res.json({ success: true, count: jobs.length, total, pages: Math.ceil(total / limit), jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get single job
// @route  GET /api/jobs/:id
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Create job
// @route  POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Update job
// @route  PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Delete job
// @route  DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    await Application.deleteMany({ job: req.params.id });
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
