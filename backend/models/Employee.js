const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      required: [true, 'Employee ID is required'],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 15,
    },
    mobileNo: { type: String, trim: true },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    dateOfBirth: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other'], trim: true },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: 0,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      country: { type: String, trim: true, default: 'India' },
    },
    permanentAddress: { type: String, trim: true },
    location: { type: String, trim: true },
    panNo: { type: String, trim: true },
    aadharNo: { type: String, trim: true },
    uanNo: { type: String, trim: true },
    pfNo: { type: String, trim: true },
    esiNo: { type: String, trim: true },
    epsNo: { type: String, trim: true },
    npsNo: { type: String, trim: true },
    bankName: { type: String, trim: true },
    bankBranch: { type: String, trim: true },
    bankAccountNo: { type: String, trim: true },
    ifscCode: { type: String, trim: true },
    avatar: {
      fileId: String,
      url: String,
    },
    documents: [
      {
        name: String,
        fileId: String,
        url: String,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'terminated'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

employeeSchema.index({ department: 1 });
employeeSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

employeeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Employee', employeeSchema);
