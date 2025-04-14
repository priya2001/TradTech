import Customer from '../models/Customer.js';
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
  const { shopId, glassSize, quantity, paymentMethod } = req.body;

  // Validate input
  if (!shopId || !glassSize || !quantity || !paymentMethod) {
    return next(new AppError('Missing required fields: shopId, glassSize, quantity, paymentMethod', 400));
  }

  // Get price per glass (set by shop, e.g., 500ml = ₹60, 250ml = ₹35)
  const pricePerGlass = glassSize === 500 ? 60 : 35; // Adjust prices as needed

  // Create order
  const order = await Order.create({
    shop: shopId,
    customer: req.customer.id,
    glassSize,
    quantity,
    pricePerGlass,
    paymentMethod,
    totalAmount: pricePerGlass * quantity, // Could also let pre-save hook handle it
    status: 'pending'
  });

  // Update customer's order history (optional)
  await Customer.findByIdAndUpdate(
    req.customer.id,
    { $push: { orders: order._id } },
    { new: true }
  );

  res.status(201).json({
    status: 'success',
    data: { order }
  });
});

// @desc    Get all orders (pending + successful) for a customer
// @route   GET /api/customers/my-orders
// @access  Private
export const getMyOrders = catchAsync(async (req, res, next) => {
  // 1) Fetch all orders for the customer (pending, ready, picked-up)
  const orders = await Order.find({
    customer: req.customer.id,
    status: { $in: ['pending', 'preparing', 'ready', 'picked-up'] } // Exclude cancelled
  })
    .populate({
      path: 'shop',
      select: 'shopName address.location mobileNumber' // Shop details
    })
    .sort('-orderedAt'); // Newest first

  // 2) Separate into pending vs. completed
  const pendingOrders = orders.filter(
    order => order.status === 'pending' || order.status === 'preparing'
  );
  const completedOrders = orders.filter(
    order => order.status === 'ready' || order.status === 'picked-up'
  );

  // 3) Send structured response
  res.status(200).json({
    status: 'success',
    data: {
      pending: pendingOrders,
      completed: completedOrders,
      totalOrders: orders.length
    }
  });
});

// @desc    Protect middleware (used in routes)
// @access  Private
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
  console.log('Restricting to roles:', roles); // Add this
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) { // Fix: req.user instead of req.customer
      return next(new AppError('No permission!', 403));
    }
    next();
  };
};