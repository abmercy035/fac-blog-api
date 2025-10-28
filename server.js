const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();


// Middleware
app.set("trust proxy", 1);

// CORS Configuration
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3002'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 'Origin', 'X-Requested-With',
    'Accept', 'Authorization'
  ],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const authorRoutes = require('./routes/authors');
const categoryRoutes = require('./routes/categories');
const subscriberRoutes = require('./routes/subscribers');
const adminRoutes = require('./routes/admin');
const cloudinaryRoutes = require('./routes/cloudinary');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
	res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).json({
		message: err.message || 'Internal Server Error',
		error: process.env.NODE_ENV === 'development' ? err : {}
	});
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;

// Start health ping cron when running the server directly
try {
  const startHealthCron = require('./health-cron')
  const healthUrl = process.env.HEALTH_PING_URL || `http://localhost:${PORT}/api/health`
  startHealthCron({ url: healthUrl, intervalMs: (14 * 60 * 1000) + (59 * 1000) })
} catch (err) {
  console.warn('health-cron not started:', err.message)
}
