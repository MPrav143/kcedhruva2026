const express = require('express');
const router = express.Router();
const { loginAdmin, logoutAdmin, setupAdmin, getDashboardStats } = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.post('/setup', setupAdmin); // NOTE: Disable or protect this route in production!
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
