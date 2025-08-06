import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';

const router = express.Router();

// Validation middleware
const createCategoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name is required and must be less than 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Category description is required and must be less than 500 characters'),
  body('image')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category image is required'),
  body('slug')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category slug is required')
];

const updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name must be less than 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Category description must be less than 500 characters'),
  body('image')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category image cannot be empty'),
  body('slug')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category slug cannot be empty')
];

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createCategoryValidation, createCategory);
router.put('/:id', protect, authorize('admin'), updateCategoryValidation, updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router; 