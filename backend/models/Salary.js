const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const salarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee is required'],
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 2000,
    },
    basic: { type: Number, default: 0, min: 0 },
    hra: { type: Number, default: 0, min: 0 },
    specialHra: { type: Number, default: 0, min: 0 },
    medicalAllowance: { type: Number, default: 0, min: 0 },
    otherAllowance: { type: Number, default: 0, min: 0 },
    overtime: { type: Number, default: 0, min: 0 },
    allowances: { type: Number, default: 0, min: 0 },
    employeePf: { type: Number, default: 0, min: 0 },
    professionalTax: { type: Number, default: 0, min: 0 },
    loanDeductions: { type: Number, default: 0, min: 0 },
    otherDeductions: { type: Number, default: 0, min: 0 },
    deductions: { type: Number, default: 0, min: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    taxRegime: { type: String, trim: true },
    loanOutstanding: {
      date: Date,
      balance: { type: Number, default: 0 },
      deductionForMonth: { type: Number, default: 0 },
      principal: { type: Number, default: 0 },
      interest: { type: Number, default: 0 },
    },
    attendance: {
      daysInMonth: { type: Number, default: 0 },
      offDays: { type: Number, default: 0 },
      lopDays: { type: Number, default: 0 },
      netWorkingDays: { type: Number, default: 0 },
    },
    workingHours: {
      aggregate: { type: Number, default: 0 },
      firstShift: { type: Number, default: 0 },
      overtimeHr: { type: Number, default: 0 },
      totalWorkingHours: { type: Number, default: 0 },
    },
    preparer: { type: String, trim: true },
    approver: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
    paymentDate: Date,
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

salarySchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });
salarySchema.index({ status: 1 });

salarySchema.pre('save', function (next) {
  this.totalEarnings =
    Number(this.basic || 0) + Number(this.hra || 0) + Number(this.specialHra || 0) +
    Number(this.medicalAllowance || 0) + Number(this.otherAllowance || 0) +
    Number(this.overtime || 0) + Number(this.allowances || 0);
  this.totalDeductions =
    Number(this.employeePf || 0) + Number(this.professionalTax || 0) +
    Number(this.loanDeductions || 0) + Number(this.otherDeductions || 0) +
    Number(this.deductions || 0);
  this.netSalary = this.totalEarnings - this.totalDeductions;
  next();
});

salarySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Salary', salarySchema);
