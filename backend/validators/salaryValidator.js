const { body } = require('express-validator');

const salaryValidator = [
  body('employee')
    .notEmpty()
    .withMessage('Employee is required')
    .isMongoId()
    .withMessage('Invalid employee ID'),
  body('month')
    .notEmpty()
    .withMessage('Month is required')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100'),
  body('basic')
    .notEmpty()
    .withMessage('Basic salary is required')
    .isFloat({ min: 0 })
    .withMessage('Basic salary must be a positive number'),
  body('hra').optional().isFloat({ min: 0 }),
  body('specialHra').optional().isFloat({ min: 0 }),
  body('medicalAllowance').optional().isFloat({ min: 0 }),
  body('otherAllowance').optional().isFloat({ min: 0 }),
  body('overtime').optional().isFloat({ min: 0 }),
  body('allowances').optional().isFloat({ min: 0 }),
  body('employeePf').optional().isFloat({ min: 0 }),
  body('professionalTax').optional().isFloat({ min: 0 }),
  body('loanDeductions').optional().isFloat({ min: 0 }),
  body('otherDeductions').optional().isFloat({ min: 0 }),
  body('deductions').optional().isFloat({ min: 0 }),
  body('taxRegime').optional().trim(),
  body('loanOutstanding.balance').optional().isFloat({ min: 0 }),
  body('loanOutstanding.deductionForMonth').optional().isFloat({ min: 0 }),
  body('loanOutstanding.principal').optional().isFloat({ min: 0 }),
  body('loanOutstanding.interest').optional().isFloat({ min: 0 }),
  body('attendance.daysInMonth').optional().isInt({ min: 0 }),
  body('attendance.offDays').optional().isInt({ min: 0 }),
  body('attendance.lopDays').optional().isInt({ min: 0 }),
  body('attendance.netWorkingDays').optional().isInt({ min: 0 }),
  body('workingHours.aggregate').optional().isFloat({ min: 0 }),
  body('workingHours.firstShift').optional().isFloat({ min: 0 }),
  body('workingHours.overtimeHr').optional().isFloat({ min: 0 }),
  body('workingHours.totalWorkingHours').optional().isFloat({ min: 0 }),
  body('preparer').optional().trim(),
  body('approver').optional().trim(),
  body('status')
    .optional()
    .isIn(['pending', 'paid', 'cancelled'])
    .withMessage('Invalid status'),
];

module.exports = { salaryValidator };
