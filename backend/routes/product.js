const router = require('express').Router();
const {
  createProduct,
  getProducts,
  getPublicProducts,
  getProduct,
  getPublicProductBySlug,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  uploadImages,
  deleteImage,
  setMainImage,
  uploadProductSheet,
} = require('../controllers/productController');
const { productValidator, productUpdateValidator } = require('../validators/productValidator');
const validate = require('../middlewares/validate');
const { auth, authorize } = require('../middlewares/auth');
const { uploadMultipleImages, uploadPDF } = require('../middlewares/upload');

router.get('/public', getPublicProducts);
router.get('/public/:slug', getPublicProductBySlug);

router.use(auth);

router.post('/', authorize('admin', 'manager'), productValidator, validate, createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', authorize('admin', 'manager'), productUpdateValidator, validate, updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);
router.patch('/:id/toggle-status', authorize('admin', 'manager'), toggleProductStatus);

router.post('/:id/images', authorize('admin', 'manager'), uploadMultipleImages.array('images', 10), uploadImages);
router.delete('/:id/images/:imageId', authorize('admin', 'manager'), deleteImage);
router.patch('/:id/images/:imageId/main', authorize('admin', 'manager'), setMainImage);

router.post('/:id/sheet', authorize('admin', 'manager'), uploadPDF.single('sheet'), uploadProductSheet);

module.exports = router;
