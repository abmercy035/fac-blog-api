const Subscriber = require('../models/Subscriber');

// @desc    Add a new subscriber
// @route   POST /api/subscribers
// @access  Public
const addSubscriber = async (req, res) => {
  try {
    const { email, name, source } = req.body;

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      if (!existingSubscriber.isActive) {
        existingSubscriber.isActive = true;
        await existingSubscriber.save();
        return res.json(existingSubscriber);
      }
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const subscriber = await Subscriber.create({
      email,
      name,
      source: source || 'homepage'
    });

    res.status(201).json(subscriber);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all subscribers (Admin only)
// @route   GET /api/subscribers
// @access  Private (Admin)
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update subscriber (Admin only)
// @route   PUT /api/subscribers/:id
// @access  Private (Admin)
const updateSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    res.json(subscriber);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete subscriber (Admin only)
// @route   DELETE /api/subscribers/:id
// @access  Private (Admin)
const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsubscribe by email
// @route   POST /api/subscribers/unsubscribe
// @access  Public
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      { isActive: false },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSubscriber,
  getSubscribers,
  updateSubscriber,
  deleteSubscriber,
  unsubscribe,
};
