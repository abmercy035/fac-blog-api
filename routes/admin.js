const express = require('express');
const router = express.Router();
const {
	getStats,
	getAllPosts,
	getAllComments,
	getAllUsers,
	updateUserRole,
	deleteUser,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/posts', getAllPosts);
router.get('/comments', getAllComments);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
