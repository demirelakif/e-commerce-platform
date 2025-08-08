import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/User";

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;

    // Build query
    const query: any = {};
    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Execute query
    const users = await User.find(query)
      .select("-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }

    const { firstName, lastName, phone } = req.body;

    const user = await User.findByIdAndUpdate(req.user!._id, { firstName, lastName, phone }, { new: true, runValidators: true });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }

    const { type, street, city, state, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user!._id);

    if (isDefault) {
      // Remove default from other addresses of same type
      user!.addresses.forEach((address) => {
        if (address.type === type) {
          address.isDefault = false;
        }
      });
    }

    user!.addresses.push({
      type,
      street,
      city,
      state,
      zipCode,
      country: country || "United States",
      isDefault: isDefault || false,
    });

    await user!.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Add address error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }

    const { type, street, city, state, zipCode, country, isDefault } = req.body;
    const addressId = req.params.id;

    const user = await User.findById(req.user!._id);
    const addressIndex = parseInt(addressId);
    if (addressIndex < 0 || addressIndex >= user!.addresses.length) {
      return res.status(404).json({
        success: false,
        error: "Address not found",
      });
    }

    if (isDefault) {
      // Remove default from other addresses of same type
      user!.addresses.forEach((address, index) => {
        if (address.type === type && index !== addressIndex) {
          address.isDefault = false;
        }
      });
    }

    user!.addresses[addressIndex] = {
      ...user!.addresses[addressIndex],
      type,
      street,
      city,
      state,
      zipCode,
      country: country || "United States",
      isDefault: isDefault || false,
    };

    await user!.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Update address error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id;

    const user = await User.findById(req.user!._id);
    const addressIndex = parseInt(addressId);
    if (addressIndex < 0 || addressIndex >= user!.addresses.length) {
      return res.status(404).json({
        success: false,
        error: "Address not found",
      });
    }

    user!.addresses.splice(addressIndex, 1);
    await user!.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Delete address error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Set default address
// @route   PUT /api/users/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id;

    const user = await User.findById(req.user!._id);
    const addressIndex = parseInt(addressId);
    if (addressIndex < 0 || addressIndex >= user!.addresses.length) {
      return res.status(404).json({
        success: false,
        error: "Address not found",
      });
    }
    const address = user!.addresses[addressIndex];

    if (!address) {
      return res.status(404).json({
        success: false,
        error: "Address not found",
      });
    }

    // Remove default from other addresses of same type
    user!.addresses.forEach((addr) => {
      if (addr.type === address.type) {
        addr.isDefault = false;
      }
    });

    // Set this address as default
    address.isDefault = true;
    await user!.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Set default address error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Update preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = async (req: Request, res: Response) => {
  try {
    const { favoriteCategories, newsletterSubscription } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      {
        "preferences.favoriteCategories": favoriteCategories,
        "preferences.newsletterSubscription": newsletterSubscription,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).populate("wishlist", "name mainImage price averageRating");

    res.json({
      success: true,
      data: user!.wishlist || [],
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user!._id);

    if (!user!.wishlist) {
      user!.wishlist = [];
    }

    if (user!.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        error: "Product already in wishlist",
      });
    }

    user!.wishlist.push(productId);
    await user!.save();

    const populatedUser = await User.findById(user!._id).populate("wishlist", "name mainImage price averageRating");

    res.json({
      success: true,
      data: populatedUser!.wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user!._id);

    if (!user!.wishlist) {
      return res.status(404).json({
        success: false,
        error: "Wishlist is empty",
      });
    }

    const productIndex = user!.wishlist.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Product not found in wishlist",
      });
    }

    user!.wishlist.splice(productIndex, 1);
    await user!.save();

    const populatedUser = await User.findById(user!._id).populate("wishlist", "name mainImage price averageRating");

    res.json({
      success: true,
      data: populatedUser!.wishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
