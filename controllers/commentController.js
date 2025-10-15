const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
const getComments = async (req, res) => {
	try {
		const comments = await Comment.find({
			postId: req.params.postId,
		}).sort({ createdAt: -1 });

		res.json(comments);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Add a comment to a post
// @route   POST /api/comments
// @access  Public
const addComment = async (req, res) => {
	try {
		const { postId, author, email, content } = req.body;
console.log(req.body)
		// Check if post exists
		const post = await BlogPost.findById(postId);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		const comment = await Comment.create({
			postId,
			author,
			email,
			content,
			isApproved: true
		});

		// Update post comments count
		post.commentsCount += 1;
		await post.save();

		res.status(201).json(comment);
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update a comment (Admin only)
// @route   PUT /api/comments/:id
// @access  Private (Admin)
const updateComment = async (req, res) => {
	try {
		const comment = await Comment.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		res.json(comment);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete a comment (Admin only)
// @route   DELETE /api/comments/:id
// @access  Private (Admin)
const deleteComment = async (req, res) => {
	try {
		const comment = await Comment.findByIdAndDelete(req.params.id);

		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		// Update post comments count
		const post = await BlogPost.findById(comment.postId);
		if (post && post.commentsCount > 0) {
			post.commentsCount -= 1;
			await post.save();
		}

		res.json({ message: 'Comment deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Approve a comment (Admin only)
// @route   PUT /api/comments/:id/approve
// @access  Private (Admin)
const approveComment = async (req, res) => {
	try {
		const comment = await Comment.findByIdAndUpdate(
			req.params.id,
			{ isApproved: true },
			{ new: true }
		);

		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		res.json(comment);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getComments,
	addComment,
	updateComment,
	deleteComment,
	approveComment,
};
