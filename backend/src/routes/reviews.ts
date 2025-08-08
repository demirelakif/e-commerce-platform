import express from "express";
import { body } from "express-validator";
import { protect, authorize } from "../middleware/auth";
import {
  getReviews,
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  getMyReviews,
} from "../controllers/reviewController";

const router = express.Router();

// Validation middleware
const createReviewValidation = [
  body("product").isMongoId().withMessage("Valid product ID is required"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").trim().isLength({ min: 10, max: 1000 }).withMessage("Review comment must be between 10 and 1000 characters"),
  body("title").optional().trim().isLength({ min: 1, max: 100 }).withMessage("Review title must be less than 100 characters"),
];

const updateReviewValidation = [
  body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Review comment must be between 10 and 1000 characters"),
  body("title").optional().trim().isLength({ min: 1, max: 100 }).withMessage("Review title must be less than 100 characters"),
];

// Public routes
router.get("/product/:productId", getProductReviews);

// Admin routes
router.get("/", protect, authorize("admin"), getReviews);

// Protected routes (customer)
router.get("/my-reviews", protect, getMyReviews);
router.post("/", protect, createReviewValidation, createReview);
router.put("/:id", protect, updateReviewValidation, updateReview);
router.delete("/:id", protect, deleteReview);

// Admin routes
router.put("/:id/approve", protect, authorize("admin"), approveReview);

export default router;
