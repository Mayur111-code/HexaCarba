const router = require('express').Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/profileController');
const { changePasswordValidator } = require('../validators/authValidator');
const validate = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');

router.use(auth);

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/change-password', changePasswordValidator, validate, changePassword);

module.exports = router;
