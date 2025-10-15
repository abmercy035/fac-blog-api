const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 3
	},
	bio: {
		type: String,
		trim: true,
		minlength: 10
	},
	title: {
		type: String,
		default: 'Writer'
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	name: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ['admin', 'editor', 'viewer'],
		default: 'viewer'
	},
	avatar: {
		type: String,
		default: '/placeholder-user.jpg'
	},
	social: {
		linkedin: String,
		facebook: String,
		twitter: String,
		instagram: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	lastLogin: {
		type: Date
	}
});

// Hash password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Hash password on findOneAndUpdate/findByIdAndUpdate
userSchema.pre('findOneAndUpdate', async function (next) {
	const update = this.getUpdate();

	// Check if password is being updated
	if (update.password || (update.$set && update.$set.password)) {
		const password = update.password || update.$set.password;

		// Only hash if password is not already hashed (bcrypt hashes start with $2)
		if (!password.startsWith('$2')) {
			try {
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(password, salt);

				if (update.$set) {
					update.$set.password = hashedPassword;
				} else {
					update.password = hashedPassword;
				}
			} catch (error) {
				return next(error);
			}
		}
	}

	next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.password;
	return obj;
};

module.exports = mongoose.model('User', userSchema);
