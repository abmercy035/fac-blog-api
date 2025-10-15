const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
	try {
		const { username, email, password, name } = req.body;

		// Check if user already exists
		const userExists = await User.findOne({ $or: [{ email }, { username }] });

		if (userExists) {
			return res.status(400).json({ message: 'User already exists' });
		}

		// Create user
		const user = await User.create({
			username,
			email,
			password,
			name,
			role: 'viewer'
		});

		if (user) {
			res.status(201).json({
				_id: user._id,
				username: user.username,
				title: user.title,
				email: user.email,
				name: user.name,
				bio: user.bio,
				role: user.role,
				avatar: user.avatar,
				social: user.social,
				token: generateToken(user._id),
			});
		} else {
			res.status(400).json({ message: 'Invalid user data' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
	try {
		const { username, password } = req.body;
console.log(req.body)
		// Check for user
		const user = await User.findOne({ username });

		if (user && (await user.comparePassword(password))) {
			// Update last login
			user.lastLogin = new Date();
			await user.save();

			res.json({
				_id: user._id,
				username: user.username,
					title: user.title,
				email: user.email,
				name: user.name,
				bio: user.bio,
				role: user.role,
				avatar: user.avatar,
				social: user.social,
				lastLogin: user.lastLogin,
				token: generateToken(user._id),
			});
		} else {
			res.status(401).json({ message: 'Invalid credentials' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Validate session
// @route   GET /api/auth/validate
// @access  Private
const validateSession = async (req, res) => {
	try {
		res.json({
			valid: true,
			user: req.user
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	register,
	login,
	getMe,
	validateSession,
};
