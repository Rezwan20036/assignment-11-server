const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { verifyToken, verifyAdmin, verifyStaff } = require('../middleware/authMiddleware');

router.get('/', issueController.getAllIssues);
router.get('/resolved', issueController.getResolvedIssues);
router.post('/', verifyToken, issueController.createIssue);
router.get('/:id', issueController.getIssueById);
router.patch('/upvote/:id', verifyToken, issueController.upvoteIssue);
router.patch('/:id', verifyToken, issueController.updateIssue);
router.delete('/:id', verifyToken, verifyAdmin, issueController.deleteIssue);

module.exports = router;
