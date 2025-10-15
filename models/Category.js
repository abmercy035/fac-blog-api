const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Generate slug before saving
categorySchema.pre('save', function (next) {
	if (!this.slug) {
		this.slug = this.name
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');
	}
	next();
});

module.exports = mongoose.model('Category', categorySchema);
