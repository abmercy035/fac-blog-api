const BlogPost = require('../models/BlogPost');

// @desc    Get all published posts with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Public
const getPosts = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const posts = await BlogPost.find({ isPublished: true })
			.populate('author')
			.populate('category')
			.sort({ publishedAt: -1 })
			.skip(skip)
			.limit(limit);

		const total = await BlogPost.countDocuments({ isPublished: true });

		res.json({
			posts,
			total,
			page,
			pages: Math.ceil(total / limit)
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPostBySlug = async (req, res) => {
	try {
		const post = await BlogPost.findOne({
			slug: req.params.slug,
			isPublished: true
		})
			.populate('author')
			.populate('category');

		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		res.json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get post by ID
// @route   GET /api/posts/id/:id
// @access  Public
const getPostById = async (req, res) => {
	try {
		const post = await BlogPost.findById(req.params.id)
			.populate('author')
			.populate('category');

		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		res.json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get posts by category
// @route   GET /api/posts/category/:slug
// @access  Public
const getPostsByCategory = async (req, res) => {
	try {
		const Category = require('../models/Category');
		const category = await Category.findOne({ slug: req.params.slug });

		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		const posts = await BlogPost.find({
			category: category._id,
			isPublished: true
		})
			.populate('author')
			.populate('category')
			.sort({ publishedAt: -1 });

		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get posts by author
// @route   GET /api/posts/author/:username
// @access  Public
const getPostsByAuthor = async (req, res) => {
	try {
		const User = require('../models/User');
		const author = await User.findOne({ username: req.params.username });

		if (!author) {
			return res.status(404).json({ message: 'Author not found' });
		}

		const posts = await BlogPost.find({
			author: author._id,
			isPublished: true
		})
			.populate('author')
			.populate('category')
			.sort({ publishedAt: -1 });

		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Search posts
// @route   GET /api/posts/search?q=query
// @access  Public
const searchPosts = async (req, res) => {
	try {
		const query = req.query.q;

		if (!query) {
			return res.status(400).json({ message: 'Search query is required' });
		}

		const posts = await BlogPost.find({
			isPublished: true,
			$text: { $search: query }
		})
			.populate('author')
			.populate('category')
			.sort({ score: { $meta: 'textScore' } });

		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Public
const likePost = async (req, res) => {
	try {
		const post = await BlogPost.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		post.likes += 1;
		await post.save();

		res.json({ likes: post.likes });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create a new post (Editor/Admin only)
// @route   POST /api/posts
// @access  Private (Editor/Admin)
const createPost = async (req, res) => {
	try {
		console.log(req.user._id.toString())
		const postBody = { ...req.body, author: req.user._id.toString() }
		const post = await BlogPost.create(postBody);
		await post.populate('author');
		await post.populate('category');

		res.status(201).json(post);
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update a post (Editor/Admin only)
// @route   PUT /api/posts/:id
// @access  Private (Editor/Admin)
const updatePost = async (req, res) => {
	try {
		const post = await BlogPost.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		)
			.populate('author')
			.populate('category');

		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		res.json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete a post (Admin only)
// @route   DELETE /api/posts/:id
// @access  Private (Admin)
const deletePost = async (req, res) => {
	try {
		const post = await BlogPost.findByIdAndDelete(req.params.id);

		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		// Also delete related comments
		const Comment = require('../models/Comment');
		await Comment.deleteMany({ postId: post._id });

		res.json({ message: 'Post deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
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
};
