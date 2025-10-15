const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	content: {
		type: String,
		required: true
	},
	excerpt: {
		type: String,
		required: true
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: true
	},
	tags: [{
		type: String,
		trim: true
	}],
	slug: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	featuredImage: {
		type: String,
		default: '/placeholder.jpg'
	},
	isPublished: {
		type: Boolean,
		default: false
	},
	likes: {
		type: Number,
		default: 0
	},
	commentsCount: {
		type: Number,
		default: 0
	},
	publishedAt: {
		type: Date
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Generate slug before saving
blogPostSchema.pre('save', function (next) {
	if (this.isModified('title') && !this.slug) {
		this.slug = this.title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.substring(0, 100);
	}

	if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
		this.publishedAt = new Date();
	}

	this.updatedAt = new Date();
	next();
});


// Generate slug before saving
blogPostSchema.pre('findOneAndUpdate', function (next) {
	if (this.isModified('title') && !this.slug) {
		this.slug = this.title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.substring(0, 100);
	}

	if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
		this.publishedAt = new Date();
	}

	this.updatedAt = new Date();
	next();
});

// Indexes for better query performance
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ author: 1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ isPublished: 1 });
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('BlogPost', blogPostSchema);
