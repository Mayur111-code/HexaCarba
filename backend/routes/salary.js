const router = require('express').Router();
const {
  createSalary,
  getSalaries,
  getSalary,
  getEmployeeSalaries,
  updateSalary,
  deleteSalary,
  downloadSalaryPDF,
} = require('../controllers/salaryController');
const { salaryValidator } = require('../validators/salaryValidator');
const validate = require('../middlewares/validate');
const { auth, authorize } = require('../middlewares/auth');

router.use(auth);

router.post('/', authorize('admin', 'manager'), salaryValidator, validate, createSalary);
router.get('/', getSalaries);
router.get('/employee/:employeeId', getEmployeeSalaries);
router.get('/:id/pdf', downloadSalaryPDF);
router.get('/:id', getSalary);
router.put('/:id', authorize('admin', 'manager'), updateSalary);
router.delete('/:id', authorize('admin'), deleteSalary);

module.exports = router;
