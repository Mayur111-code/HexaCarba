const router = require('express').Router();
const { login, refreshToken, logout, getMe } = require('../controllers/authController');
const { loginValidator } = require('../validators/authValidator');
const validate = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');

router.post('/login', loginValidator, validate, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);

module.exports = router;
