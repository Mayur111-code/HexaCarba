const { body } = require('express-validator');

const customerValidator = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 200 })
    .withMessage('Company name must be under 200 characters'),
  body('contactPerson')
    .trim()
    .notEmpty()
    .withMessage('Contact person is required')
    .isLength({ max: 100 }),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required'),
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'lead'])
    .withMessage('Invalid status'),
];

module.exports = { customerValidator };
