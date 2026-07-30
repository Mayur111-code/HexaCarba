const { body } = require('express-validator');

const employeeValidator = [
  body('employeeId')
    .trim()
    .notEmpty()
    .withMessage('Employee ID is required'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name must be under 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name must be under 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required'),
  body('designation')
    .trim()
    .notEmpty()
    .withMessage('Designation is required'),
  body('joiningDate')
    .notEmpty()
    .withMessage('Joining date is required')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('salary')
    .notEmpty()
    .withMessage('Salary is required')
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone must be between 10 and 15 characters'),
  body('mobileNo').optional().trim(),
  body('gender').optional().isIn(['Male', 'Female', 'Other']),
  body('dateOfBirth').optional().isISO8601(),
  body('permanentAddress').optional().trim(),
  body('location').optional().trim(),
  body('panNo').optional().trim(),
  body('aadharNo').optional().trim(),
  body('uanNo').optional().trim(),
  body('pfNo').optional().trim(),
  body('esiNo').optional().trim(),
  body('epsNo').optional().trim(),
  body('npsNo').optional().trim(),
  body('bankName').optional().trim(),
  body('bankBranch').optional().trim(),
  body('bankAccountNo').optional().trim(),
  body('ifscCode').optional().trim(),
];

const employeeUpdateValidator = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ max: 50 }),
  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ max: 50 }),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'terminated'])
    .withMessage('Invalid status value'),
];

module.exports = { employeeValidator, employeeUpdateValidator };
