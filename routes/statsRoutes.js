const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { verifyToken, verifyAdmin, verifyStaff } = require('../middleware/authMiddleware');

router.get('/admin', verifyToken, verifyAdmin, statsController.getAdminStats);
router.get('/staff/:staffId', verifyToken, verifyStaff, statsController.getStaffStats);

module.exports = router;
