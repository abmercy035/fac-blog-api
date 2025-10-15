const express = require('express');
const router = express.Router();
const {
	getPosts,
	getPostBySlug,
	getPostById,
	getPostsByCategory,
	getPostsByAuthor,
	searchPosts,
	likePost,
	createPost,
	updatePost,
	deletePost,
} = require('../controllers/postController');
const { protect, editor, admin } = require('../middleware/auth');

// Public routes
router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/category/:slug', getPostsByCategory);
router.get('/author/:username', getPostsByAuthor);
router.get('/id/:id', getPostById);
router.get('/:slug', getPostBySlug);
router.post('/:id/like', likePost);

// Protected routes (Editor/Admin)
router.post('/', protect, editor, createPost);
router.put('/:id', protect, editor, updatePost);

// Protected routes (Admin only)
router.delete('/:id', protect, admin, deletePost);

module.exports = router;
