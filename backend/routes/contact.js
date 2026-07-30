const router = require('express').Router();
const {
  createContact,
  getContacts,
  getContact,
  markAsRead,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');
const { contactValidator } = require('../validators/contactValidator');
const validate = require('../middlewares/validate');
const { auth, authorize } = require('../middlewares/auth');

router.post('/', contactValidator, validate, createContact);

router.use(auth);

router.get('/', getContacts);
router.get('/:id', getContact);
router.put('/:id', authorize('admin', 'manager'), updateContact);
router.patch('/:id/read', markAsRead);
router.delete('/:id', authorize('admin'), deleteContact);

module.exports = router;
