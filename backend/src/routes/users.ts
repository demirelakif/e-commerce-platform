import express from "express";
import { body } from "express-validator";
import { protect, authorize } from "../middleware/auth";
import {
  getUsers,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  updatePreferences,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/userController";

const router = express.Router();

// Validation middleware
const updateProfileValidation = [
  body("firstName").optional().trim().isLength({ min: 1, max: 50 }).withMessage("First name must be less than 50 characters"),
  body("lastName").optional().trim().isLength({ min: 1, max: 50 }).withMessage("Last name must be less than 50 characters"),
  body("phone")
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please enter a valid phone number"),
];

const addressValidation = [
  body("type").isIn(["shipping", "billing"]).withMessage("Address type must be shipping or billing"),
  body("street").trim().isLength({ min: 1 }).withMessage("Street address is required"),
  body("city").trim().isLength({ min: 1 }).withMessage("City is required"),
  body("state").trim().isLength({ min: 1 }).withMessage("State is required"),
  body("zipCode").trim().isLength({ min: 1 }).withMessage("Zip code is required"),
  body("country").optional().trim().isLength({ min: 1 }).withMessage("Country cannot be empty"),
  body("isDefault").optional().isBoolean().withMessage("isDefault must be a boolean"),
];

// Admin routes
router.get("/", protect, authorize("admin"), getUsers);

// Protected routes
router.put("/profile", protect, updateProfileValidation, updateProfile);
router.post("/addresses", protect, addressValidation, addAddress);
router.put("/addresses/:id", protect, addressValidation, updateAddress);
router.delete("/addresses/:id", protect, deleteAddress);
router.put("/addresses/:id/default", protect, setDefaultAddress);
router.put("/preferences", protect, updatePreferences);
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, addToWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

export default router;
