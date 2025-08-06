import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  getUserOrders
} from '../controllers/orderController';

const router = express.Router();

// Validation middleware
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.product')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress')
    .isObject()
    .withMessage('Shipping address is required'),
  body('shippingAddress.firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('shippingAddress.lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  body('shippingAddress.street')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 1 })
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .isLength({ min: 1 })
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Zip code is required'),
  body('shippingAddress.phone')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Phone number is required'),
  body('paymentMethod')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Payment method is required')
];

const updateOrderValidation = [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid order status'),
  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Tracking number cannot be empty')
];

// Protected routes (customer)
router.get('/my-orders', protect, getUserOrders);
router.post('/', protect, createOrderValidation, createOrder);
router.get('/:id', protect, getOrder);

// Admin routes
router.get('/', protect, authorize('admin'), getOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderValidation, updateOrderStatus);

export default router; 