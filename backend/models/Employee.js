const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId:   { type: String, unique: true, required: true },
  firstName:    { type: String, required: true },
  lastName:     { type: String, required: true },
  email:        { type: String, required: true },
  phone:        { type: String },
  dateOfBirth:  { type: Date },
  gender:       { type: String, enum: ['male', 'female', 'other'] },
  address: {
    street:  { type: String },
    city:    { type: String },
    state:   { type: String },
    country: { type: String, default: 'India' },
    zip:     { type: String }
  },
  department:   { type: String, required: true },
  designation:  { type: String, required: true },
  employeeType: { type: String, enum: ['full-time', 'part-time', 'contract', 'intern'], default: 'full-time' },
  joiningDate:  { type: Date, required: true },
  probationEnd: { type: Date },
  salary:       { type: Number, default: 0 },
  bankDetails: {
    accountName:   { type: String },
    accountNumber: { type: String },
    bankName:      { type: String },
    ifscCode:      { type: String }
  },
  documents: [{
    name: String,
    url:  String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  status:       { type: String, enum: ['active', 'inactive', 'terminated'], default: 'active' },
  manager:      { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  skills:       [String],
  emergencyContact: {
    name:         String,
    relationship: String,
    phone:        String
  }
}, { timestamps: true });

employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Employee', employeeSchema);
