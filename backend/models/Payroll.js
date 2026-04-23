const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee:   { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month:      { type: Number, required: true }, // 1-12
  year:       { type: Number, required: true },
  basicSalary:      { type: Number, required: true },
  hra:              { type: Number, default: 0 },
  allowances:       { type: Number, default: 0 },
  overtimePay:      { type: Number, default: 0 },
  bonus:            { type: Number, default: 0 },
  grossSalary:      { type: Number, default: 0 },
  taxDeduction:     { type: Number, default: 0 },
  pfDeduction:      { type: Number, default: 0 },
  employerEPF:      { type: Number, default: 0 },
  employerEPS:      { type: Number, default: 0 },
  otherDeductions:  { type: Number, default: 0 },
  totalDeductions:  { type: Number, default: 0 },
  netSalary:        { type: Number, default: 0 },
  daysWorked:       { type: Number, default: 0 },
  daysAbsent:       { type: Number, default: 0 },
  leaveDays:        { type: Number, default: 0 },
  status:           { type: String, enum: ['draft', 'processed', 'paid'], default: 'draft' },
  paidOn:           { type: Date },
  processedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  payslipUrl:       { type: String }
}, { timestamps: true });

// Auto-calculate totals before save
payrollSchema.pre('save', function(next) {
  this.grossSalary    = this.basicSalary + this.hra + this.allowances + this.overtimePay + this.bonus;
  this.totalDeductions = this.taxDeduction + this.pfDeduction + this.otherDeductions;
  this.netSalary      = this.grossSalary - this.totalDeductions;
  next();
});

module.exports = mongoose.model('Payroll', payrollSchema);
