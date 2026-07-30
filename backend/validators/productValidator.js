const { body } = require('express-validator');

const productValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Product name must be under 200 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ max: 300 })
    .withMessage('Short description must be under 300 characters'),
  body('longDescription')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Long description must be under 5000 characters'),
  body('applications')
    .optional()
    .isArray()
    .withMessage('Applications must be an array'),
  body('industries')
    .optional()
    .isArray()
    .withMessage('Industries must be an array'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  body('specifications')
    .optional()
    .isArray()
    .withMessage('Specifications must be an array'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'draft'])
    .withMessage('Invalid status value'),
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 70 })
    .withMessage('SEO title must be under 70 characters'),
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('SEO description must be under 160 characters'),
];

const productUpdateValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty')
    .isLength({ max: 200 }),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('shortDescription')
    .optional()
    .trim()
    .notEmpty()
    .isLength({ max: 300 }),
];

module.exports = { productValidator, productUpdateValidator };
