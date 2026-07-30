const employeeService = require('../services/employeeService');
const ApiResponse = require('../utils/ApiResponse');

const createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    ApiResponse.success(res, employee, 'Employee created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getEmployees = async (req, res, next) => {
  try {
    const result = await employeeService.getEmployees(req.query);
    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.getEmployee(req.params.id);
    ApiResponse.success(res, employee);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body);
    ApiResponse.success(res, employee, 'Employee updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    await employeeService.deleteEmployee(req.params.id);
    ApiResponse.success(res, null, 'Employee deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createEmployee, getEmployees, getEmployee, updateEmployee, deleteEmployee };
