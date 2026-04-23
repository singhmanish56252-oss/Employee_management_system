const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee:   { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date:       { type: Date, required: true },
  checkIn:    { type: Date },
  checkOut:   { type: Date },
  status:     { type: String, enum: ['present', 'absent', 'late', 'half-day', 'on-leave', 'holiday'], default: 'present' },
  workHours:  { type: Number, default: 0 },
  overtime:   { type: Number, default: 0 },
  notes:      { type: String },
  markedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const leaveSchema = new mongoose.Schema({
  employee:   { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  leaveType:  { type: String, enum: ['sick', 'casual', 'earned', 'maternity', 'paternity', 'unpaid'], required: true },
  startDate:  { type: Date, required: true },
  endDate:    { type: Date, required: true },
  days:       { type: Number, required: true },
  reason:     { type: String, required: true },
  status:     { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks:    { type: String }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
const Leave = mongoose.model('Leave', leaveSchema);

module.exports = { Attendance, Leave };
