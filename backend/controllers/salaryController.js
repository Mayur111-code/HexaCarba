const salaryService = require('../services/salaryService');
const pdfService = require('../services/pdfService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const createSalary = async (req, res, next) => {
  try {
    const salary = await salaryService.createSalary(req.body);
    ApiResponse.success(res, salary, 'Salary record created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getSalaries = async (req, res, next) => {
  try {
    const result = await salaryService.getSalaries(req.query);
    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getSalary = async (req, res, next) => {
  try {
    const salary = await salaryService.getSalary(req.params.id);
    ApiResponse.success(res, salary);
  } catch (error) {
    next(error);
  }
};

const getEmployeeSalaries = async (req, res, next) => {
  try {
    const result = await salaryService.getEmployeeSalaries(req.params.employeeId, req.query);
    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

const updateSalary = async (req, res, next) => {
  try {
    const salary = await salaryService.updateSalary(req.params.id, req.body);
    ApiResponse.success(res, salary, 'Salary record updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteSalary = async (req, res, next) => {
  try {
    await salaryService.deleteSalary(req.params.id);
    ApiResponse.success(res, null, 'Salary record deleted successfully');
  } catch (error) {
    next(error);
  }
};

const downloadSalaryPDF = async (req, res, next) => {
  try {
    const salary = await salaryService.getSalary(req.params.id);
    const pdfBuffer = await pdfService.generateSalaryPDF(salary);

    const employee = salary.employee;
    const fileName = `Salary_Slip_${employee.firstName}_${employee.lastName}_${salary.month}_${salary.year}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = { createSalary, getSalaries, getSalary, getEmployeeSalaries, updateSalary, deleteSalary, downloadSalaryPDF };
