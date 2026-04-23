const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job:         { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantName:  { type: String, required: true },
  applicantEmail: { type: String, required: true },
  phone:       { type: String },
  resume:      { type: String }, // file URL
  coverLetter: { type: String },
  experience:  { type: Number, default: 0 },
  currentCompany: { type: String },
  expectedSalary: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'rejected', 'hired'],
    default: 'pending'
  },
  notes:       { type: String },
  appliedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stageHistory: [{
    stage:     String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
