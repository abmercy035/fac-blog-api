# VicBlog Backend Server

Express.js + MongoDB backend API for the VicBlog application.

## 📋 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, Editor, Viewer)
- **Blog Management**: Full CRUD operations for blog posts with pagination and search
- **Comment System**: Comment management with approval workflow
- **Category Management**: Organize posts by categories
- **Author Profiles**: Manage author information and social links
- **Subscriber Management**: Email subscription system
- **Admin Dashboard**: Statistics and content management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env`:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure secret key for JWT tokens
     - `PORT`: Server port (default: 5000)

3. Seed the database with initial data:
```bash
npm run seed
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run server:dev

# Production mode
npm run server
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── adminController.js    # Admin operations
│   ├── authController.js     # Authentication
│   ├── authorController.js   # Author management
│   ├── categoryController.js # Category management
│   ├── commentController.js  # Comment management
│   ├── postController.js     # Blog post operations
│   └── subscriberController.js # Subscriber management
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── Author.js            # Author schema
│   ├── BlogPost.js          # Blog post schema
│   ├── Category.js          # Category schema
│   ├── Comment.js           # Comment schema
│   ├── Subscriber.js        # Subscriber schema
│   └── User.js              # User schema
├── routes/
│   ├── admin.js             # Admin routes
│   ├── auth.js              # Auth routes
│   ├── authors.js           # Author routes
│   ├── categories.js        # Category routes
│   ├── comments.js          # Comment routes
│   ├── posts.js             # Post routes
│   └── subscribers.js       # Subscriber routes
├── seed.js                  # Database seeding script
└── server.js                # Express app entry point
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user (Protected)
- `GET /validate` - Validate session (Protected)

### Blog Posts (`/api/posts`)
- `GET /` - Get all published posts (with pagination)
- `GET /search` - Search posts
- `GET /:slug` - Get post by slug
- `GET /id/:id` - Get post by ID
- `GET /category/:slug` - Get posts by category
- `GET /author/:username` - Get posts by author
- `POST /:id/like` - Like a post
- `POST /` - Create post (Editor/Admin)
- `PUT /:id` - Update post (Editor/Admin)
- `DELETE /:id` - Delete post (Admin)

### Comments (`/api/comments`)
- `GET /:postId` - Get comments for a post
- `POST /` - Add comment
- `PUT /:id` - Update comment (Admin)
- `DELETE /:id` - Delete comment (Admin)
- `PUT /:id/approve` - Approve comment (Admin)

### Authors (`/api/authors`)
- `GET /` - Get all authors
- `GET /:username` - Get author by username
- `POST /` - Create author (Admin)
- `PUT /:id` - Update author (Admin)
- `DELETE /:id` - Delete author (Admin)

### Categories (`/api/categories`)
- `GET /` - Get all categories
- `GET /:slug` - Get category by slug
- `POST /` - Create category (Admin)
- `PUT /:id` - Update category (Admin)
- `DELETE /:id` - Delete category (Admin)

### Subscribers (`/api/subscribers`)
- `POST /` - Subscribe
- `POST /unsubscribe` - Unsubscribe
- `GET /` - Get all subscribers (Admin)
- `PUT /:id` - Update subscriber (Admin)
- `DELETE /:id` - Delete subscriber (Admin)

### Admin (`/api/admin`)
- `GET /stats` - Get dashboard statistics (Admin)
- `GET /posts` - Get all posts including drafts (Admin)
- `GET /comments` - Get all comments (Admin)
- `GET /users` - Get all users (Admin)
- `PUT /users/:id/role` - Update user role (Admin)
- `DELETE /users/:id` - Delete user (Admin)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **Admin**: Full access to all endpoints
- **Editor**: Can create and manage blog posts
- **Viewer**: Read-only access (public endpoints)

## 🗄️ Database Models

### User
- username, email, password (hashed)
- role (admin/editor/viewer)
- name, avatar
- timestamps

### Author
- name, username, title, bio
- email, avatar
- social links (Facebook, LinkedIn, etc.)

### BlogPost
- title, content, excerpt
- author (ref), category (ref)
- tags, slug
- featuredImage
- isPublished, publishedAt
- likes, commentsCount

### Comment
- postId (ref), author, email
- content, isApproved
- replies (nested)

### Category
- name, description, slug

### Subscriber
- email, name
- isActive, receiveNewPostAlerts
- source, subscribedAt


## 🛠️ Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/vicblog
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

## 📝 Notes

- All passwords are hashed using bcryptjs
- JWT tokens expire after 30 days
- Comments require admin approval before being visible
- Text search is available on posts (title, content, tags)
- Slugs are auto-generated from titles

## 🔄 Development

Run in development mode with auto-reload:
```bash
npm run server:dev
```

## 📦 Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Set a strong `JWT_SECRET`
4. Configure proper CORS settings for your frontend domain
5. Use a process manager like PM2:
```bash
pm2 start server/server.js --name vicblog-api
```

## 🤝 Contributing

1. Create feature branches
2. Write clean, documented code
3. Test thoroughly before committing
4. Submit pull requests for review
