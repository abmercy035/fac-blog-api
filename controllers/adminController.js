const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Subscriber = require('../models/Subscriber');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
	try {
		const totalPosts = await BlogPost.countDocuments();
		const publishedPosts = await BlogPost.countDocuments({ isPublished: true });
		const draftPosts = await BlogPost.countDocuments({ isPublished: false });
		const totalComments = await Comment.countDocuments();
		const pendingComments = await Comment.countDocuments({ isApproved: false });
		const totalUsers = await User.countDocuments();
		const totalSubscribers = await Subscriber.countDocuments({ isActive: true });

		const totalLikes = await BlogPost.aggregate([
			{ $group: { _id: null, total: { $sum: '$likes' } } }
		]);

		// Recent activity
		const recentPosts = await BlogPost.find()
			.populate('author')
			.sort({ createdAt: -1 })
			.limit(5)
			.select('title author createdAt');

		const recentComments = await Comment.find()
			.populate('postId', 'title')
			.sort({ createdAt: -1 })
			.limit(5)
			.select('author postId createdAt');

		const recentActivity = [
			...recentPosts.map(post => ({
				type: 'post',
				title: post.title,
				author: post.author?.name || 'Unknown',
				date: post.createdAt
			})),
			...recentComments.map(comment => ({
				type: 'comment',
				title: `Comment on: ${comment.postId?.title || 'Unknown Post'}`,
				author: comment.author,
				date: comment.createdAt
			}))
		].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

		res.json({
			totalPosts,
			publishedPosts,
			draftPosts,
			totalComments,
			pendingComments,
			totalUsers,
			totalSubscribers,
			totalLikes: totalLikes[0]?.total || 0,
			recentActivity
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get all posts (including drafts) for admin
// @route   GET /api/admin/posts
// @access  Private (Admin)
const getAllPosts = async (req, res) => {
	try {
		const posts = await BlogPost.find()
			.populate('author')
			.populate('category')
			.sort({ createdAt: -1 });

		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get all comments (including unapproved) for admin
// @route   GET /api/admin/comments
// @access  Private (Admin)
const getAllComments = async (req, res) => {
	try {
		const comments = await Comment.find()
			.populate('postId', 'title slug')
			.sort({ createdAt: -1 });

		res.json(comments);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().sort({ createdAt: -1 });
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res) => {
	try {
		const { role } = req.body;

		if (!['admin', 'editor', 'viewer'].includes(role)) {
			return res.status(400).json({ message: 'Invalid role' });
		}

		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ role },
			{ new: true }
		).select('-password');

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getStats,
	getAllPosts,
	getAllComments,
	getAllUsers,
	updateUserRole,
	deleteUser,
};
