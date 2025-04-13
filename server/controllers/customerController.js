import Customer from '../models/Customer.js';
import Juice from '../models/Juice.js';
import Order from '../models/Order.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

// Helper function to filter object properties
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Generate JWT token
const signToken = (id) => {
    // Set default if not specified
    const expiresIn = process.env.JWT_EXPIRES_IN || '90d';
    
    // Validate the format
    if (!/^\d+[smhd]?$/.test(expiresIn)) {
      throw new Error('Invalid JWT expiration format. Use like "1d", "2h", or "3600"');
    }
  
    return jwt.sign(
      { id },
      process.env.JWT_SECRET,
      { expiresIn }
    );
  };

// Create and send token
const createSendToken = (customer, statusCode, res) => {
  const token = signToken(customer._id);
  
  // Remove password from output
  customer.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      customer
    }
  });
};

// @desc    Sign up a new customer
// @route   POST /api/customers/signup
// @access  Public
export const signup = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    
    // Simple validation
    if (!name || !email || !password || !passwordConfirm) {
      return next(new AppError('All fields are required', 400));
    }
    
    if (password !== passwordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }
  
    const newCustomer = await Customer.create({
      name,
      email,
      password,
      passwordConfirm
    });
  
    // Remove password from output
    newCustomer.password = undefined;
  
    res.status(201).json({
      status: 'success',
      data: {
        customer: newCustomer
      }
    });
  });

// @desc    Login customer
// @route   POST /api/customers/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
    console.log('Login attempt with:', req.body.email); // Add this
    
    const { email, password } = req.body;
    
    // 1) Check if email and password exist
    if (!email || !password) {
      console.log('Missing credentials');
      return next(new AppError('Please provide email and password!', 400));
    }
  
    // 2) Check if user exists && password is correct
    const customer = await Customer.findOne({ email }).select('+password');
    console.log('Found customer:', customer ? customer.email : 'none');
    
    if (!customer || !(await customer.correctPassword(password, customer.password))) {
      console.log('Invalid credentials');
      return next(new AppError('Incorrect email or password', 401));
    }
  
    // 3) If everything ok, send token to client
    console.log('Login successful for:', customer.email);
    createSendToken(customer, 200, res);
  });

// @desc    Logout customer (client-side implementation)
// @route   GET /api/customers/logout
// @access  Private
export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

// @desc    Get current customer profile
// @route   GET /api/customers/me
// @access  Private
export const getMe = catchAsync(async (req, res, next) => {
  const customer = await Customer.findById(req.customer.id);
  res.status(200).json({
    status: 'success',
    data: {
      customer
    }
  });
});

// @desc    Update current customer profile
// @route   PATCH /api/customers/updateMe
// @access  Private
export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if customer POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email', 'profilePic', 'mobileNumber');

  // 3) Update customer document
  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.customer.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      customer: updatedCustomer
    }
  });
});

// @desc    Order juice
// @route   POST /api/customers/order-juice
// @access  Private
export const orderJuice = catchAsync(async (req, res, next) => {
  // 1) Get the juice and check if it exists
  const juice = await Juice.findById(req.body.juiceId);
  if (!juice) {
    return next(new AppError('No juice found with that ID', 404));
  }

  // 2) Create order
  const order = await Order.create({
    juice: req.body.juiceId,
    customer: req.customer.id,
    quantity: req.body.quantity,
    price: juice.price * req.body.quantity,
    deliveryAddress: req.body.deliveryAddress || req.customer.address
  });

  // 3) Update customer's order history
  await Customer.findByIdAndUpdate(
    req.customer.id,
    { $push: { orders: order._id } },
    { new: true }
  );

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Get customer's order history
// @route   GET /api/customers/my-orders
// @access  Private
export const getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ customer: req.customer.id })
    .populate('juice')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

// @desc    Protect middleware (used in routes)
// @access  Private
export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if customer still exists
  const currentCustomer = await Customer.findById(decoded.id);
  if (!currentCustomer) {
    return next(
      new AppError('The customer belonging to this token does no longer exist.', 401)
    );
  }

  // 4) Check if customer changed password after the token was issued
  if (currentCustomer.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Customer recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.customer = currentCustomer;
  next();
});

// @desc    Restrict middleware (used in routes)
// @access  Private/Admin
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.customer.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};