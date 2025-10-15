const express = require('express');
const router = express.Router();
const {
	getAuthors,
	getAuthor,
	createAuthor,
	updateAuthor,
	deleteAuthor,
} = require('../controllers/authorController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getAuthors);
router.get('/:username', getAuthor);

// Protected routes (Admin only)
router.post('/', protect, admin, createAuthor);
router.put('/:id', protect, admin, updateAuthor);
router.delete('/:id', protect, admin, deleteAuthor);

module.exports = router;
