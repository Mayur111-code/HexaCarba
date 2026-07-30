const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildPaginationMeta, buildSearchFilter } = require('../utils/helpers');

const createEmployee = async (data) => {
  const existingEmail = await Employee.findOne({ email: data.email });
  if (existingEmail) {
    throw ApiError.conflict('An employee with this email already exists');
  }
  const existingId = await Employee.findOne({ employeeId: data.employeeId });
  if (existingId) {
    throw ApiError.conflict('An employee with this employee ID already exists');
  }
  return Employee.create(data);
};

const getEmployees = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.search) {
    Object.assign(
      filter,
      buildSearchFilter(
        ['firstName', 'lastName', 'email', 'employeeId', 'department', 'designation'],
        query.search
      )
    );
  }
  if (query.department) filter.department = query.department;
  if (query.status) filter.status = query.status;

  const sort = query.sort || '-createdAt';

  const [employees, total] = await Promise.all([
    Employee.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Employee.countDocuments(filter),
  ]);

  return {
    data: employees,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

const getEmployee = async (id) => {
  const employee = await Employee.findById(id);
  if (!employee) throw ApiError.notFound('Employee not found');
  return employee;
};

const updateEmployee = async (id, data) => {
  if (data.email) {
    const existing = await Employee.findOne({ email: data.email, _id: { $ne: id } });
    if (existing) throw ApiError.conflict('An employee with this email already exists');
  }
  const employee = await Employee.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!employee) throw ApiError.notFound('Employee not found');
  return employee;
};

const deleteEmployee = async (id) => {
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) throw ApiError.notFound('Employee not found');
  return employee;
};

module.exports = { createEmployee, getEmployees, getEmployee, updateEmployee, deleteEmployee };
