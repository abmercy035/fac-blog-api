const express = require('express');
const router = express.Router();
const {
	addSubscriber,
	getSubscribers,
	updateSubscriber,
	deleteSubscriber,
	unsubscribe,
} = require('../controllers/subscriberController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/', addSubscriber);
router.post('/unsubscribe', unsubscribe);

// Protected routes (Admin only)
router.get('/', protect, admin, getSubscribers);
router.put('/:id', protect, admin, updateSubscriber);
router.delete('/:id', protect, admin, deleteSubscriber);

module.exports = router;
