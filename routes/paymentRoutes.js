const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, paymentController.createPayment);
router.get('/', verifyToken, verifyAdmin, paymentController.getAllPayments);
router.get('/user/:userId', verifyToken, paymentController.getPaymentsByUser);

module.exports = router;
