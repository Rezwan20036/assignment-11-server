const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', userController.createUser);
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);
router.patch('/make-premium', verifyToken, userController.makePremium);
router.patch('/update', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);
router.get('/:email', userController.getUserByEmail);

module.exports = router;
