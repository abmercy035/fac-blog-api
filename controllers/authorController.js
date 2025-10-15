const User = require('../models/User');

// @desc    Get all authors (users with editor or admin role)
// @route   GET /api/authors
// @access  Public
const getAuthors = async (req, res) => {
	try {
		const authors = await User.find({
			role: { $in: ['editor', 'admin'] }
		}).select('-password');
		res.json(authors);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get author by username
// @route   GET /api/authors/:username
// @access  Public
const getAuthor = async (req, res) => {
	try {
		const author = await User.findOne({
			username: req.params.username,
			role: { $in: ['editor', 'admin'] }
		}).select('-password');

		if (!author) {
			return res.status(404).json({ message: 'Author not found' });
		}

		res.json(author);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create author (Admin only) - Now handled by User creation
// @route   POST /api/authors
// @access  Private (Admin)
const createAuthor = async (req, res) => {
	try {
		// Ensure the user has editor or admin role
		const userData = { ...req.body, role: req.body.role || 'editor' };
		const author = await User.create(userData);
		res.status(201).json(author);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update author (Admin only)
// @route   PUT /api/authors/:id
// @access  Private (Admin)
const updateAuthor = async (req, res) => {
	try {
		// Remove password from update data to prevent accidental plain text password updates
		const { password, ...updateData } = req.body;

		const author = await User.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ new: true, runValidators: true }
		).select('-password');

		if (!author) {
			return res.status(404).json({ message: 'Author not found' });
		}

		res.json(author);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete author (Admin only)
// @route   DELETE /api/authors/:id
// @access  Private (Admin)
const deleteAuthor = async (req, res) => {
	try {
		const author = await User.findByIdAndDelete(req.params.id);

		if (!author) {
			return res.status(404).json({ message: 'Author not found' });
		}

		res.json({ message: 'Author deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getAuthors,
	getAuthor,
	createAuthor,
	updateAuthor,
	deleteAuthor,
};
