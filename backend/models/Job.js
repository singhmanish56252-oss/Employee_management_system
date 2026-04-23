const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  department:   { type: String, required: true },
  description:  { type: String, required: true },
  requirements: [String],
  responsibilities: [String],
  type:         { type: String, enum: ['full-time', 'part-time', 'contract', 'intern'], default: 'full-time' },
  location:     { type: String, default: 'Remote' },
  salaryMin:    { type: Number },
  salaryMax:    { type: Number },
  experience:   { type: String },
  skills:       [String],
  status:       { type: String, enum: ['open', 'closed', 'paused'], default: 'open' },
  deadline:     { type: Date },
  postedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicationsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
