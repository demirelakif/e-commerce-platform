import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { firstName, lastName, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
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
        error: errors.array()[0].msg
      });
    }

    const { type, street, city, state, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user!._id);

    if (isDefault) {
      // Remove default from other addresses of same type
      user!.addresses.forEach(address => {
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
      country: country || 'United States',
      isDefault: isDefault || false
    });

    await user!.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
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
        error: errors.array()[0].msg
      });
    }

    const { type, street, city, state, zipCode, country, isDefault } = req.body;
    const addressId = req.params.id;

    const user = await User.findById(req.user!._id);
    const addressIndex = user!.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    if (isDefault) {
      // Remove default from other addresses of same type
      user!.addresses.forEach(address => {
        if (address.type === type && address._id.toString() !== addressId) {
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
      country: country || 'United States',
      isDefault: isDefault || false
    };

    await user!.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
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
    const addressIndex = user!.addresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    user!.addresses.splice(addressIndex, 1);
    await user!.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
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
    const address = user!.addresses.find(
      addr => addr._id.toString() === addressId
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    // Remove default from other addresses of same type
    user!.addresses.forEach(addr => {
      if (addr.type === address.type) {
        addr.isDefault = false;
      }
    });

    // Set this address as default
    address.isDefault = true;
    await user!.save();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
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
        'preferences.favoriteCategories': favoriteCategories,
        'preferences.newsletterSubscription': newsletterSubscription
      },
      { new: true }
    );

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id)
      .populate('wishlist', 'name mainImage price averageRating');

    res.json({
      success: true,
      data: user!.wishlist || []
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
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
        error: 'Product already in wishlist'
      });
    }

    user!.wishlist.push(productId);
    await user!.save();

    const populatedUser = await User.findById(user!._id)
      .populate('wishlist', 'name mainImage price averageRating');

    res.json({
      success: true,
      data: populatedUser!.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
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
        error: 'Wishlist is empty'
      });
    }

    const productIndex = user!.wishlist.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found in wishlist'
      });
    }

    user!.wishlist.splice(productIndex, 1);
    await user!.save();

    const populatedUser = await User.findById(user!._id)
      .populate('wishlist', 'name mainImage price averageRating');

    res.json({
      success: true,
      data: populatedUser!.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 