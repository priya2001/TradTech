import Shopkeeper from "../models/Shopkeeper.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import sendEmail from "../utils/email.js";
import Admin from "../models/Admin.js";
import { SHOPKEEPER_APPROVAL_EMAIL_REQUEST_TEMPLATE } from "../utils/emailTemplates.js";

// Helper function to sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Send token and response
const createSendToken = (shopkeeper, statusCode, res) => {
  const token = signToken(shopkeeper._id);

  // Remove password from output
  shopkeeper.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      shopkeeper: {
        data: shopkeeper,
      },
    },
  });
};

// @desc    Shopkeeper signup (pending admin approval)
// @route   POST /api/shopkeepers/signup
// @access  Public
export const signup = catchAsync(async (req, res, next) => {
  const {
    name,
    shopName,
    email,
    password,
    passwordConfirm,
    mobileNumber,
    licenseNumber,
    address,
  } = req.body;

  // Basic validation
  if (!licenseNumber) {
    return next(
      new AppError("License number is required for registration", 400)
    );
  }

  // Ensure coordinates are provided before saving
  if (!address?.location?.coordinates) {
    return next(new AppError("Please provide location coordinates", 400));
  }

  const newShopkeeper = await Shopkeeper.create({
    name,
    shopName,
    email,
    password,
    passwordConfirm,
    mobileNumber,
    licenseNumber,
    address: {
      // Make sure to include the address object
      location: {
             type: "Point",
            coordinates: address.location.coordinates,
            address:address.location.address      },
    },
    active: false, // Default to inactive until approved by admin
  });

  // Send email to admin for approval
  const approvalUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/admin/approve-shopkeeper/${newShopkeeper._id}`;

  // Get single admin email
  const admin = await Admin.findOne({ role: "admin" }).select("email");

  // Send to admin (email comes from TradTech)
  await sendEmail({
    email: admin || process.env.ADMIN_EMAIL, // Or from your config
    subject: "New Shopkeeper Approval Request",
    message: SHOPKEEPER_APPROVAL_EMAIL_REQUEST_TEMPLATE.replace(
      "{shopName}",
      newShopkeeper.shopName
    )
      .replace("{licenseNumber}", newShopkeeper.licenseNumber)
      .replace("{approvalUrl}", approvalUrl),
  });

  res.status(201).json({
    status: "success",
    message: "Registration successful! Your account is pending admin approval.",
    data: {
      shopkeeper: {
        _id: newShopkeeper._id,
        name,
        shopName,
        email,
        mobileNumber,
      },
    },
  });
});

// @desc    Shopkeeper login
// @route   POST /api/shopkeepers/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    // 2) Check if shopkeeper exists && password is correct
    const shopkeeper = await Shopkeeper.findOne({ email, active: true }).select(
      "+password"
    );
    if (
      !shopkeeper ||
      !(await shopkeeper.correctPassword(password, shopkeeper.password))
    ) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(shopkeeper, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    return next(
      new AppError("Login failed. Please check your credentials.", 500)
    );
  }
});

// @desc    Shopkeeper logout
// @route   GET /api/shopkeepers/logout
// @access  Private
export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// @desc    Update shop location
// @route   PATCH /api/shopkeepers/update-location
// @access  Private
export const updateLocation = catchAsync(async (req, res, next) => {
  const { coordinates, address, staticMapImageUrl } = req.body;

  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return next(
      new AppError(
        "Please provide valid coordinates [longitude, latitude]",
        400
      )
    );
  }

  const updatedShopkeeper = await Shopkeeper.findByIdAndUpdate(
    req.shopkeeper.id,
    {
      "address.location": {
        type: "Point",
        coordinates,
        address: address || "",
        staticMapImageUrl: staticMapImageUrl || "",
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      shopkeeper: updatedShopkeeper,
    },
  });
});

// @desc    Get current shopkeeper profile
// @route   GET /api/shopkeepers/me
// @access  Private
export const getMe = catchAsync(async (req, res, next) => {
  const shopkeeper = await Shopkeeper.findById(req.shopkeeper.id);

  res.status(200).json({
    status: "success",
    data: {
      shopkeeper,
    },
  });
});

// @desc    Update shopkeeper profile
// @route   PATCH /api/shopkeepers/update-me
// @access  Private
export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /update-my-password.",
        400
      )
    );
  }

  // 2) Filter out unwanted fields names that are not allowed to be updated
  const filteredBody = {
    name: req.body.name,
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
    profilePic: req.body.profilePic,
  };

  // 3) Update shopkeeper document
  const updatedShopkeeper = await Shopkeeper.findByIdAndUpdate(
    req.shopkeeper.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      shopkeeper: updatedShopkeeper,
    },
  });
});

// Middleware to protect routes
export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  // Check Authorization header first
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // If not in header, check query parameters
  else if (
    req.query.Authorization &&
    req.query.Authorization.startsWith("Bearer")
  ) {
    token = req.query.Authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if shopkeeper still exists
  const currentShopkeeper = await Shopkeeper.findById(decoded.id);
  if (!currentShopkeeper) {
    return next(
      new AppError(
        "The shopkeeper belonging to this token no longer exists.",
        401
      )
    );
  }

  // 4) Check if shopkeeper changed password after the token was issued
  if (currentShopkeeper.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Shopkeeper recently changed password! Please log in again.",
        401
      )
    );
  }

  // 5) Check if shopkeeper is active (approved by admin)
  // if (!currentShopkeeper.active) {
  //     return next(
  //         new AppError('Your account is not yet approved by admin.', 403)
  //     );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.shopkeeper = currentShopkeeper;
  next();
});

// @desc    Deactivate shopkeeper account
// @route   DELETE /api/shopkeepers/deactivate
// @access  Private
export const deactivateAccount = catchAsync(async (req, res, next) => {
  await Shopkeeper.findByIdAndUpdate(req.shopkeeper.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// @desc    Update shopkeeper password
// @route   PATCH /api/shopkeepers/update-password
// @access  Private
export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get shopkeeper from collection
  const shopkeeper = await Shopkeeper.findById(req.shopkeeper.id).select(
    "+password"
  );

  // 2) Check if current password is correct
  if (
    !(await shopkeeper.correctPassword(
      req.body.currentPassword,
      shopkeeper.password
    ))
  ) {
    return next(new AppError("Your current password is wrong", 401));
  }

  // 3) Update password
  shopkeeper.password = req.body.password;
  shopkeeper.passwordConfirm = req.body.passwordConfirm;
  await shopkeeper.save();

  // 4) Log shopkeeper in, send new JWT
  createSendToken(shopkeeper, 200, res);
});
