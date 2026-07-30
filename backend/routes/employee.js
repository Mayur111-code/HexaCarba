const router = require('express').Router();
const {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { employeeValidator, employeeUpdateValidator } = require('../validators/employeeValidator');
const validate = require('../middlewares/validate');
const { auth, authorize } = require('../middlewares/auth');

router.use(auth);

router.post('/', authorize('admin', 'manager'), employeeValidator, validate, createEmployee);
router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.put('/:id', authorize('admin', 'manager'), employeeUpdateValidator, validate, updateEmployee);
router.delete('/:id', authorize('admin'), deleteEmployee);

module.exports = router;
