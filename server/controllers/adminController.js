import Admin from '../models/Admin.js';
import Shopkeeper from '../models/Shopkeeper.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import sendEmail from '../utils/email.js';
import { SHOPKEEPER_APPROVAL_EMAIL_TEMPLATE, 
  SHOPKEEPER_REJECTION_EMAIL_TEMPLATE
} from '../utils/emailTemplates.js';
import Customer from '../models/customer.js';

// Helper function to sign JWT token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Send token and response
const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin._id);

  // Remove password from output
  admin.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      admin
    }
  });
};

// @desc    Admin signup (should be used only once to create first admin)
// @route   POST /api/admin/signup
// @access  Private (should be protected by a special route or done manually)
export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  // Check if admin already exists
  const adminExists = await Admin.findOne({ role: 'admin' });
  if (adminExists) {
    return next(new AppError('Admin already exists', 400));
  }

  const newAdmin = await Admin.create({
    name,
    email,
    password,
    passwordConfirm,
    role: 'admin'
  });

  createSendToken(newAdmin, 201, res);
});

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if admin exists && password is correct
  const admin = await Admin.findOne({ email }).select('+password');
  console.log("admin : ",admin);
  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(admin, 200, res);
});

// @desc    Get all pending shopkeeper registrations
// @route   GET /api/admin/pending-registrations
// @access  Private/Admin
export const getPendingRegistrations = catchAsync(async (req, res, next) => {
  const pendingShopkeepers = await Shopkeeper.find({ active: false });

  res.status(200).json({
    status: 'success',
    results: pendingShopkeepers.length,
    data: {
      shopkeepers: pendingShopkeepers
    }
  });
});

// @desc    Approve shopkeeper registration
// @route   PATCH /api/admin/approve-shopkeeper/:id
// @access  Private/Admin
export const approveShopkeeper = catchAsync(async (req, res, next) => {
  const shopkeeper = await Shopkeeper.findByIdAndUpdate(
    req.params.id,
    { active: true },
    { new: true, runValidators: true }
  );

  if (!shopkeeper) {
    return next(new AppError('No shopkeeper found with that ID', 404));
  }

  // Send approval email to shopkeeper
  await sendEmail({
    email: shopkeeper.email,
    subject: 'Your Shop Registration Has Been Approved',
    message: SHOPKEEPER_APPROVAL_EMAIL_TEMPLATE
      .replace('{shopName}', shopkeeper.shopName)
      .replace('{loginUrl}', 'https://yourplatform.com/login')
  });

  res.status(200).json({
    status: 'success',
    data: {
      shopkeeper
    }
  });
});

// @desc    Reject shopkeeper registration
// @route   DELETE /api/admin/reject-shopkeeper/:id
// @access  Private/Admin
export const rejectShopkeeper = catchAsync(async (req, res, next) => {
  const shopkeeper = await Shopkeeper.findByIdAndDelete(req.params.id);

  if (!shopkeeper) {
    return next(new AppError('No shopkeeper found with that ID', 404));
  }
  let rejectionReason = req.body.rejectionReason || 'Does not meet our current marketplace requirements.';

  // Send rejection email to shopkeeper
  await sendEmail({
    email: shopkeeper.email,
    subject: 'Your Shop Registration Has Been Rejected',
    message: SHOPKEEPER_REJECTION_EMAIL_TEMPLATE
      .replace('{shopName}', shopkeeper.shopName)
      .replace('{rejectionReason}', rejectionReason || 'Does not meet our current marketplace requirements.')
      .replace('{supportEmail}', 'support@tradtech.com')
      .replace('{supportUrl}', 'https://tradtech.com/contact')
      .replace('{reapplyAfterDays}', '30')
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Get all shopkeepers
// @route   GET /api/admin/shopkeepers
// @access  Private/Admin
export const getAllShopkeepers = catchAsync(async (req, res, next) => {
  const shopkeepers = await Shopkeeper.find();

  res.status(200).json({
    status: 'success',
    results: shopkeepers.length,
    data: {
      shopkeepers
    }
  });
});

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await Customer.find();

  res.status(200).json({
    status: 'success',
    results: customers.length,
    data: {
      customers
    }
  });
});

// @desc    Get admin profile
// @route   GET /api/admin/me
// @access  Private/Admin
export const getMe = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);

  res.status(200).json({
    status: 'success',
    data: {
      admin
    }
  });
});

// @desc    Update admin profile
// @route   PATCH /api/admin/update-me
// @access  Private/Admin
export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if admin POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-my-password.',
        400
      )
    );
  }

  // 2) Filter out unwanted fields names that are not allowed to be updated
  const filteredBody = {
    name: req.body.name,
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
    profilePic: req.body.profilePic
  };

  // 3) Update admin document
  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.admin.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      admin: updatedAdmin
    }
  });
});

// @desc    Update admin password
// @route   PATCH /api/admin/update-password
// @access  Private/Admin
export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get admin from collection
  const admin = await Admin.findById(req.admin.id).select('+password');

  // 2) Check if current password is correct
  if (!(await admin.correctPassword(req.body.currentPassword, admin.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 3) Update password
  admin.password = req.body.password;
  admin.passwordConfirm = req.body.passwordConfirm;
  await admin.save();

  // 4) Log admin in, send new JWT
  createSendToken(admin, 200, res);
});

// Middleware to protect admin routes
export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  
  // Check Authorization header first
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // If not in header, check query parameters
  else if (req.query.Authorization && req.query.Authorization.startsWith('Bearer')) {
    token = req.query.Authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if admin still exists
  const currentAdmin = await Admin.findById(decoded.id);
  if (!currentAdmin) {
    return next(
      new AppError('The admin belonging to this token no longer exists.', 401)
    );
  }

  // 4) Check if admin changed password after the token was issued
  if (currentAdmin.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Admin recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.admin = currentAdmin;
  next();
});

// Middleware to restrict to admin role
export const restrictToAdmin = (req, res, next) => {
  if (req.admin.role !== 'admin') {
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  }
  next();
};