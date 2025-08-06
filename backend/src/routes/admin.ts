import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getDashboardStats,
  getRecentOrders,
  getPopularProducts,
  getSalesStats,
  getCustomerStats,
  getProductStats,
  getOrderStats,
  getReviewStats
} from '../controllers/adminController';

const router = express.Router();

// All routes require admin authorization
router.use(protect, authorize('admin'));

// Dashboard routes
router.get('/dashboard', getDashboardStats);
router.get('/recent-orders', getRecentOrders);
router.get('/popular-products', getPopularProducts);
router.get('/sales-stats', getSalesStats);
router.get('/customer-stats', getCustomerStats);
router.get('/product-stats', getProductStats);
router.get('/order-stats', getOrderStats);
router.get('/review-stats', getReviewStats);

export default router; 