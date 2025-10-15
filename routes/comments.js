const express = require('express');
const router = express.Router();
const {
	getComments,
	addComment,
	updateComment,
	deleteComment,
	approveComment,
} = require('../controllers/commentController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/:postId', getComments);
router.post('/', addComment);

// Protected routes (Admin only)
router.put('/:id', protect, admin, updateComment);
router.delete('/:id', protect, admin, deleteComment);
router.put('/:id/approve', protect, admin, approveComment);

module.exports = router;
