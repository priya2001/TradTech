import Shopkeeper from '../models/Shopkeeper.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// @desc    Get all shop locations with basic details
// @route   GET /api/shops/locations
// @access  Public
export const getShopLocations = catchAsync(async (req, res, next) => {
  const shops = await Shopkeeper.find({ active: true })
    .select('shopName email mobileNumber address profilePic')
    .lean();

  if (!shops || shops.length === 0) {
    return next(new AppError('No shops found', 404));
  }

  // Format the response
  const formattedShops = shops.map(shop => ({
    id: shop._id,
    shopName: shop.shopName,
    profilePic: shop.profilePic,
    contact: {
      email: shop.email,
      mobile: shop.mobileNumber
    },
    location: {
      type: shop.address.location.type,
      coordinates: shop.address.location.coordinates
    }
  }));

  res.status(200).json({
    status: 'success',
    results: formattedShops.length,
    data: {
      shops: formattedShops
    }
  });
});

// @desc    Get shops within a radius (in km)
// @route   GET /api/shops/nearby?lat=XX&lng=XX&radius=XX
// @access  Public
export const getShopsNearby = catchAsync(async (req, res, next) => {
  const { lat, lng, radius } = req.query;
  const defaultRadius = 10; // Default 10km radius

  if (!lat || !lng) {
    return next(new AppError('Please provide latitude and longitude', 400));
  }

  const distance = radius || defaultRadius;

  const shops = await Shopkeeper.find({
    'address.location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: distance * 1000 // Convert km to meters
      }
    },
    active: true
  }).select('shopName profilePic address.location mobileNumber');

  res.status(200).json({
    status: 'success',
    results: shops.length,
    data: {
      shops
    }
  });
});

// @desc    Get single shop details
// @route   GET /api/shops/:id
// @access  Public
export const getShopDetails = catchAsync(async (req, res, next) => {
  const shop = await Shopkeeper.findById(req.params.id)
    .select('-password -passwordChangedAt -resetPasswordOTP -resetPasswordOTPExpiry -licenseNumber -role');

  if (!shop) {
    return next(new AppError('No shop found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      shop: {
        id: shop._id,
        shopName: shop.shopName,
        profilePic: shop.profilePic,
        contact: {
          email: shop.email,
          mobile: shop.mobileNumber
        },
        location: {
          type: shop.address.location.type,
          coordinates: shop.address.location.coordinates
        },
        createdAt: shop.createdAt
      }
    }
  });
});