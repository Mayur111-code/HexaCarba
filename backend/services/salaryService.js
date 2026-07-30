const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');

const createSalary = async (data) => {
  const employee = await Employee.findById(data.employee);
  if (!employee) throw ApiError.notFound('Employee not found');

  const existing = await Salary.findOne({
    employee: data.employee,
    month: data.month,
    year: data.year,
  });
  if (existing) {
    throw ApiError.conflict('Salary record already exists for this employee for the given month/year');
  }

  return Salary.create(data);
};

const getSalaries = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.employee) filter.employee = query.employee;
  if (query.month) filter.month = parseInt(query.month, 10);
  if (query.year) filter.year = parseInt(query.year, 10);
  if (query.status) filter.status = query.status;

  const sort = query.sort || '-createdAt';

  const [salaries, total] = await Promise.all([
    Salary.find(filter)
      .populate('employee', 'firstName lastName employeeId department designation phone')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Salary.countDocuments(filter),
  ]);

  return {
    data: salaries,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

const getSalary = async (id) => {
  const salary = await Salary.findById(id).populate(
    'employee',
    'firstName lastName employeeId department designation email phone mobileNo gender dateOfBirth permanentAddress location panNo aadharNo uanNo pfNo esiNo epsNo npsNo bankName bankBranch bankAccountNo ifscCode'
  );
  if (!salary) throw ApiError.notFound('Salary record not found');
  return salary;
};

const getEmployeeSalaries = async (employeeId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = { employee: employeeId };

  if (query.year) filter.year = parseInt(query.year, 10);
  if (query.status) filter.status = query.status;

  const sort = query.sort || '-year -month';

  const [salaries, total] = await Promise.all([
    Salary.find(filter)
      .populate('employee', 'firstName lastName employeeId')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Salary.countDocuments(filter),
  ]);

  return {
    data: salaries,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

const updateSalary = async (id, data) => {
  const salary = await Salary.findById(id);
  if (!salary) throw ApiError.notFound('Salary record not found');

  if (data.basic !== undefined) salary.basic = Number(data.basic);
  if (data.hra !== undefined) salary.hra = Number(data.hra);
  if (data.specialHra !== undefined) salary.specialHra = Number(data.specialHra);
  if (data.medicalAllowance !== undefined) salary.medicalAllowance = Number(data.medicalAllowance);
  if (data.otherAllowance !== undefined) salary.otherAllowance = Number(data.otherAllowance);
  if (data.overtime !== undefined) salary.overtime = Number(data.overtime);
  if (data.allowances !== undefined) salary.allowances = Number(data.allowances);
  if (data.employeePf !== undefined) salary.employeePf = Number(data.employeePf);
  if (data.professionalTax !== undefined) salary.professionalTax = Number(data.professionalTax);
  if (data.loanDeductions !== undefined) salary.loanDeductions = Number(data.loanDeductions);
  if (data.otherDeductions !== undefined) salary.otherDeductions = Number(data.otherDeductions);
  if (data.deductions !== undefined) salary.deductions = Number(data.deductions);
  if (data.taxRegime !== undefined) salary.taxRegime = data.taxRegime;
  if (data.loanOutstanding !== undefined) salary.loanOutstanding = { ...salary.loanOutstanding, ...data.loanOutstanding };
  if (data.attendance !== undefined) salary.attendance = { ...salary.attendance, ...data.attendance };
  if (data.workingHours !== undefined) salary.workingHours = { ...salary.workingHours, ...data.workingHours };
  if (data.preparer !== undefined) salary.preparer = data.preparer;
  if (data.approver !== undefined) salary.approver = data.approver;
  if (data.month !== undefined) salary.month = data.month;
  if (data.year !== undefined) salary.year = data.year;
  if (data.status !== undefined) salary.status = data.status;
  if (data.notes !== undefined) salary.notes = data.notes;

  await salary.save();
  await salary.populate('employee', 'firstName lastName employeeId department designation phone');
  return salary;
};

const deleteSalary = async (id) => {
  const salary = await Salary.findByIdAndDelete(id);
  if (!salary) throw ApiError.notFound('Salary record not found');
  return salary;
};

module.exports = { createSalary, getSalaries, getSalary, getEmployeeSalaries, updateSalary, deleteSalary };
