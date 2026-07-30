const router = require('express').Router();
const { getStats, getRecentActivity } = require('../controllers/dashboardController');
const { auth } = require('../middlewares/auth');

router.use(auth);

router.get('/stats', getStats);
router.get('/recent', getRecentActivity);

module.exports = router;
