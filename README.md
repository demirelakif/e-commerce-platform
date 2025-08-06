# E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js, Node.js, MongoDB, and TypeScript. This platform provides a complete shopping experience with customer features, admin management, and a recommendation system.

## Project Description

This e-commerce platform offers a comprehensive shopping experience with the following main features:

### Customer Features
- **Homepage**: Clean design with hero section, featured products, and category navigation
- **Product Browsing**: Advanced filtering, sorting, and search functionality
- **Product Details**: Detailed product pages with image galleries and reviews
- **Shopping Cart**: Full cart management with quantity updates and price calculations
- **User Account**: Registration, login, profile management, and order history
- **Checkout Process**: Complete checkout with shipping and payment integration

### Admin Features
- **Admin Dashboard**: Statistics, sales trends, and order management
- **Product Management**: Add, edit, delete products with image upload
- **Customer Management**: Customer listing and detailed views
- **Order Management**: Order processing and status updates

### Recommendation System
- Popular products display
- Related products suggestions
- Browsing history-based recommendations
- "Frequently bought together" suggestions

## Technology Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Hook Form** with Zod validation
- **Ant Design** for UI components
- **Next.js Image** for optimized images

### Backend
- **Node.js 18+** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Multer** for file uploads
- **Zod** for validation
- **Nodemailer** for email services
- **bcrypt** for password hashing

### Database
- **MongoDB** with collections for users, products, categories, orders, reviews, and recommendations

## Installation Instructions

### Prerequisites
- Node.js 18 or higher
- MongoDB 6.0 or higher
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce-platform
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` files in both backend and frontend directories:

   **Backend (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_CLOUDINARY_URL=https://res.cloudinary.com/your-cloud-name
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if not running)
   mongod

   # The application will automatically create collections on first run
   ```

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on http://localhost:5000

2. **Start the frontend server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:3000

### Production Mode

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

## Demo Credentials

### Customer Account
- **Email**: customer@demo.com
- **Password**: demo123

### Admin Account
- **Email**: admin@demo.com
- **Password**: admin123

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Product Endpoints
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Category Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin only)

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (admin only)

### Review Endpoints
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review

## Deployment Guide

### Backend Deployment (Heroku)
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Add MongoDB Atlas as add-on
5. Set environment variables in Heroku dashboard
6. Deploy using Git

### Frontend Deployment (Vercel)
1. Create a Vercel account
2. Connect your GitHub repository
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

## Features List

### ✅ Implemented Features

#### Customer Features
- [x] User registration and login
- [x] Product browsing with filtering and sorting
- [x] Product detail pages with image galleries
- [x] Shopping cart functionality
- [x] Checkout process
- [x] User profile management
- [x] Order history
- [x] Product reviews and ratings
- [x] Wishlist functionality
- [x] Search functionality
- [x] Newsletter signup

#### Admin Features
- [x] Admin dashboard with statistics
- [x] Product management (CRUD operations)
- [x] Category management
- [x] Customer management
- [x] Order management
- [x] Review approval system

#### Technical Features
- [x] JWT authentication
- [x] File upload with Cloudinary
- [x] Email notifications
- [x] Responsive design
- [x] SEO optimization
- [x] TypeScript implementation
- [x] Form validation with Zod
- [x] State management with Redux Toolkit

#### Recommendation System
- [x] Popular products display
- [x] Related products suggestions
- [x] Browsing history tracking
- [x] "Frequently bought together" recommendations

### 🔄 Bonus Features
- [x] Advanced filtering system
- [x] Real-time cart updates
- [x] Email verification
- [x] Password reset functionality
- [x] Admin analytics dashboard
- [x] Bulk product operations
- [x] Advanced search with autocomplete

## Project Structure

```
e-commerce-platform/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities and configurations
│   ├── store/               # Redux store
│   └── types/               # TypeScript type definitions
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
│   └── uploads/             # File upload directory
└── README.md               # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 