import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import Review from '../models/Review';
import Category from '../models/Category';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalReviews = await Review.countDocuments();

    // Get recent stats
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    const revenueThisMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    const pendingReviews = await Review.countDocuments({ isApproved: false });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalReviews,
        ordersThisMonth,
        revenueThisMonth: revenueThisMonth[0]?.total || 0,
        pendingReviews
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get recent orders
// @route   GET /api/admin/recent-orders
// @access  Private (Admin)
export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get popular products
// @route   GET /api/admin/popular-products
// @access  Private (Admin)
export const getPopularProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name')
      .sort({ viewCount: -1, averageRating: -1 })
      .limit(10);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get popular products error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get sales stats
// @route   GET /api/admin/sales-stats
// @access  Private (Admin)
export const getSalesStats = async (req: Request, res: Response) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate: Date;
    const today = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        break;
      case 'year':
        startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    }

    const salesStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      data: salesStats
    });
  } catch (error) {
    console.error('Get sales stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get customer stats
// @route   GET /api/admin/customer-stats
// @access  Private (Admin)
export const getCustomerStats = async (req: Request, res: Response) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const verifiedCustomers = await User.countDocuments({ 
      role: 'customer',
      isEmailVerified: true 
    });
    const newCustomersThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { 
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
      }
    });

    const customerStats = await User.aggregate([
      {
        $match: { role: 'customer' }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        verifiedCustomers,
        newCustomersThisMonth,
        monthlyStats: customerStats
      }
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get product stats
// @route   GET /api/admin/product-stats
// @access  Private (Admin)
export const getProductStats = async (req: Request, res: Response) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });

    const categoryStats = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $group: {
          _id: '$category.name',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        featuredProducts,
        lowStockProducts,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get order stats
// @route   GET /api/admin/order-stats
// @access  Private (Admin)
export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);

    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        orderStatusStats,
        monthlyOrders
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get review stats
// @route   GET /api/admin/review-stats
// @access  Private (Admin)
export const getReviewStats = async (req: Request, res: Response) => {
  try {
    const totalReviews = await Review.countDocuments();
    const approvedReviews = await Review.countDocuments({ isApproved: true });
    const pendingReviews = await Review.countDocuments({ isApproved: false });

    const ratingStats = await Review.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const monthlyReviews = await Review.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalReviews,
        approvedReviews,
        pendingReviews,
        ratingStats,
        monthlyReviews
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 