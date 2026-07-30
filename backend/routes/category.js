const router = require('express').Router();
const {
  createCategory,
  getCategories,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { categoryValidator } = require('../validators/categoryValidator');
const validate = require('../middlewares/validate');
const { auth, authorize } = require('../middlewares/auth');

router.get('/public', getAllCategories);

router.use(auth);

router.post('/', authorize('admin', 'manager'), categoryValidator, validate, createCategory);
router.get('/', getCategories);
router.get('/:id', getCategory);
router.put('/:id', authorize('admin', 'manager'), categoryValidator, validate, updateCategory);
router.delete('/:id', authorize('admin'), deleteCategory);

module.exports = router;
