# 🛒 E-Commerce Platform

Modern, full-stack e-commerce platform built with Next.js 14, Node.js, MongoDB, and TypeScript. This platform provides a complete shopping experience with customer features, admin management, and advanced UI/UX.

## ✨ Features

### 🛍️ Customer Features

- **Modern Homepage**: Clean design with hero section, featured products, and category navigation
- **Advanced Product Browsing**: Filtering, sorting, search with autocomplete
- **Product Details**: Image galleries, reviews, ratings, and related products
- **Shopping Cart**: Real-time cart management with quantity updates
- **User Account**: Registration, login, profile management, order history
- **Wishlist**: Save and manage favorite products
- **Checkout Process**: Complete checkout with shipping and payment integration
- **Responsive Design**: Mobile-first approach with modern UI

### 👨‍💼 Admin Features

- **Admin Dashboard**: Statistics, sales trends, and analytics
- **Product Management**: CRUD operations with image upload via Cloudinary
- **Category Management**: Organize products by categories
- **Customer Management**: Customer listing and detailed views
- **Order Management**: Order processing and status updates
- **Review Management**: Approve and manage product reviews

### 🚀 Technical Features

- **JWT Authentication**: Secure user authentication and authorization
- **File Upload**: Cloudinary integration for image management
- **Email Notifications**: Nodemailer for transactional emails
- **Form Validation**: Express Validator for backend validation
- **State Management**: Redux Toolkit for global state
- **Data Fetching**: React Query for server state management
- **UI Components**: Ant Design for consistent UI
- **SEO Optimization**: Meta tags and structured data
- **Performance**: Image optimization and lazy loading

## 🛠️ Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript 5.3.3** - Type safety
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Redux Toolkit 1.9.7** - State management
- **React Redux 8.1.3** - React bindings for Redux
- **Ant Design 5.12.8** - UI component library
- **Axios 1.6.2** - HTTP client
- **React Query 4.36.1** - Data fetching and caching
- **React Hot Toast 2.4.1** - Toast notifications

### Backend

- **Node.js 18+** - JavaScript runtime
- **Express.js 4.18.2** - Web framework
- **TypeScript 5.3.3** - Type safety
- **MongoDB 8.0.3** - NoSQL database
- **Mongoose 8.0.3** - MongoDB ODM
- **JWT 9.0.2** - Authentication
- **bcryptjs 2.4.3** - Password hashing
- **Multer 1.4.5** - File upload handling
- **Cloudinary 1.41.0** - Cloud image management
- **Nodemailer 6.9.7** - Email service
- **CORS 2.8.5** - Cross-origin resource sharing
- **Helmet 7.1.0** - Security middleware
- **Express Rate Limit 7.1.5** - Rate limiting
- **Morgan 1.10.0** - HTTP request logger
- **Compression 1.7.4** - Response compression
- **Express Validator 7.0.1** - Input validation

### Development Tools

- **ESLint 8.56.0** - Code linting
- **Nodemon 3.0.2** - Development server
- **PostCSS 8.4.32** - CSS processing
- **Autoprefixer 10.4.16** - CSS vendor prefixes

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB 6.0 or higher
- Git

### 🛠️ Easy Installation (Recommended)

We provide convenient scripts to set up and start the project:

#### Option 1: Automatic Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd e-commerce-platform
   ```

2. **Run the installation script**

   ```bash
   chmod +x install.sh
   ./install.sh
   ```

   This script will:

   - ✅ Check Node.js and MongoDB requirements
   - ✅ Create environment files automatically
   - ✅ Install all dependencies for both frontend and backend
   - ✅ Set up the project structure

3. **Start the application**

   ```bash
   chmod +x start.sh
   ./start.sh
   ```

   This script will:

   - ✅ Check if MongoDB is running
   - ✅ Start both backend and frontend servers
   - ✅ Display application URLs and demo credentials

#### Option 2: Manual Installation

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
   JWT_SECRET=your-super-secret-jwt-key-here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NODE_ENV=development
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

### 🚀 Running the Application

#### Using Scripts (Recommended)

**Start both servers with one command:**

```bash
./start.sh
```

**Stop servers:** Press `Ctrl+C` in the terminal

#### Manual Mode

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

   Backend will run on http://localhost:5000

2. **Start the frontend server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:3000

#### Production Mode

1. **Build the frontend**

   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

## 👤 Demo Credentials

### Customer Account

- **Email**: customer@demo.com
- **Password**: demo123

### Admin Account

- **Email**: admin@demo.com
- **Password**: admin123

## 📚 API Documentation

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

## 🏗️ Project Structure

```
e-commerce-platform/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages and layouts
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── products/       # Product pages
│   │   ├── categories/     # Category pages
│   │   ├── profile/        # User profile pages
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Layout components
│   │   ├── ui/             # UI components
│   │   └── cart/           # Cart components
│   ├── lib/                # Utilities and configurations
│   ├── store/              # Redux store and slices
│   └── types/              # TypeScript type definitions
├── backend/                # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   └── uploads/            # File upload directory
├── install.sh              # Installation script
├── start.sh                # Startup script
└── README.md              # Project documentation
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

1. Create account on Heroku or Railway
2. Install CLI tools
3. Create new app
4. Add MongoDB Atlas as add-on
5. Set environment variables
6. Deploy using Git

### Frontend Deployment (Vercel)

1. Create Vercel account
2. Connect GitHub repository
3. Set environment variables
4. Deploy automatically on push

## 📋 Features Checklist

### ✅ Implemented Features

#### Customer Features

- [x] User registration and login with JWT
- [x] Product browsing with advanced filtering
- [x] Product detail pages with image galleries
- [x] Shopping cart with real-time updates
- [x] Checkout process
- [x] User profile management
- [x] Order history and tracking
- [x] Product reviews and ratings
- [x] Wishlist functionality
- [x] Advanced search with autocomplete
- [x] Newsletter signup
- [x] Responsive mobile design

#### Admin Features

- [x] Admin dashboard with analytics
- [x] Product management (CRUD)
- [x] Category management
- [x] Customer management
- [x] Order management
- [x] Review approval system
- [x] Bulk operations

#### Technical Features

- [x] JWT authentication & authorization
- [x] File upload with Cloudinary
- [x] Email notifications
- [x] Form validation with Express Validator
- [x] State management with Redux Toolkit
- [x] Data fetching with React Query
- [x] UI components with Ant Design
- [x] TypeScript implementation
- [x] SEO optimization
- [x] Performance optimization
- [x] Error handling
- [x] Loading states
- [x] Toast notifications

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
