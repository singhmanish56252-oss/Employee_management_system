const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc   Get all applications
// @route  GET /api/applications
exports.getApplications = async (req, res) => {
  try {
    const { job, status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (job) query.job = job;
    if (status) query.status = status;
    const skip = (page - 1) * limit;
    const [applications, total] = await Promise.all([
      Application.find(query).populate('job', 'title department').skip(skip).limit(Number(limit)).sort('-createdAt'),
      Application.countDocuments(query)
    ]);
    res.json({ success: true, count: applications.length, total, pages: Math.ceil(total / limit), applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Submit application (public)
// @route  POST /api/applications
exports.submitApplication = async (req, res) => {
  try {
    const job = await Job.findById(req.body.job);
    if (!job || job.status !== 'open')
      return res.status(400).json({ success: false, message: 'Job is not accepting applications' });

    const existing = await Application.findOne({ job: req.body.job, applicantEmail: req.body.applicantEmail });
    if (existing)
      return res.status(400).json({ success: false, message: 'You already applied for this job' });

    const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : req.body.resume;
    const application = await Application.create({ ...req.body, resume: resumeUrl });

    // Update applications count
    await Job.findByIdAndUpdate(req.body.job, { $inc: { applicationsCount: 1 } });

    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Update application status
// @route  PUT /api/applications/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    application.stageHistory.push({ stage: status, changedBy: req.user._id });
    application.status = status;
    if (notes) application.notes = notes;
    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Delete application
// @route  DELETE /api/applications/:id
exports.deleteApplication = async (req, res) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
