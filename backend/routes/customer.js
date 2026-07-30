const router = require('express').Router();
const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');
const { customerValidator } = require('../validators/customerValidator');
const validate = require('../middlewares/validate');
const { auth, authorize } = require('../middlewares/auth');

router.use(auth);

router.post('/', authorize('admin', 'manager'), customerValidator, validate, createCustomer);
router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.put('/:id', authorize('admin', 'manager'), customerValidator, validate, updateCustomer);
router.delete('/:id', authorize('admin'), deleteCustomer);

module.exports = router;
