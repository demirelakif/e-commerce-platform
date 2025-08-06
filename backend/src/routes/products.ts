import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  getFeaturedProducts,
  getPopularProducts,
  getRelatedProducts,
  searchProducts
} from '../controllers/productController';

const router = express.Router();

// Validation middleware
const createProductValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name is required and must be less than 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Product description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('sku')
    .trim()
    .isLength({ min: 1 })
    .withMessage('SKU is required'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be less than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Product description cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/popular', getPopularProducts);
router.get('/search', searchProducts);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createProductValidation, createProduct);
router.put('/:id', protect, authorize('admin'), updateProductValidation, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/upload-images', protect, authorize('admin'), uploadProductImages);

export default router; 