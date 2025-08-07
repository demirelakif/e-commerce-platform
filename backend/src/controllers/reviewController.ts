import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Review from '../models/Review';
import Product from '../models/Product';

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;

    // Build query
    const query: any = { 
      product: req.params.productId,
      isApproved: true 
    };
    if (rating) query.rating = parseInt(rating as string);

    // Calculate pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { product, rating, title, comment } = req.body;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user!._id,
      product
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this product'
      });
    }

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const review = await Review.create({
      user: req.user!._id,
      product,
      rating,
      title,
      comment,
      isApproved: false // Requires admin approval
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'firstName lastName');

    return res.status(201).json({
      success: true,
      data: populatedReview,
      message: 'Review submitted successfully and pending approval'
    });
  } catch (error) {
    console.error('Create review error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user?.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this review'
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName');

    res.json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user owns this review or is admin
    if (review.user?.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Approve review
// @route   PUT /api/reviews/:id/approve
// @access  Private (Admin)
export const approveReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    review.isApproved = true;
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'firstName lastName');

    res.json({
      success: true,
      data: populatedReview,
      message: 'Review approved successfully'
    });
  } catch (error) {
    console.error('Approve review error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get user reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
export const getMyReviews = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const reviews = await Review.find({ user: req.user!._id })
      .populate('product', 'name mainImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Review.countDocuments({ user: req.user!._id });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 