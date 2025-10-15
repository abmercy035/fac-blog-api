const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true
	},
	name: {
		type: String,
		trim: true
	},
	isActive: {
		type: Boolean,
		default: true
	},
	receiveNewPostAlerts: {
		type: Boolean,
		default: true
	},
	source: {
		type: String,
		enum: ['homepage', 'post', 'footer', 'popup'],
		default: 'homepage'
	},
	subscribedAt: {
		type: Date,
		default: Date.now
	}
});

// Index for better query performance
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ isActive: 1 });

module.exports = mongoose.model('Subscriber', subscriberSchema);
