const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BlogPost',
		required: true
	},
	author: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	},
	content: {
		type: String,
		required: true
	},
	isApproved: {
		type: Boolean,
		default: true
	},
	replies: [{
		author: String,
		email: String,
		content: String,
		createdAt: {
			type: Date,
			default: Date.now
		}
	}],
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Index for better query performance
commentSchema.index({ postId: 1 });
commentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
