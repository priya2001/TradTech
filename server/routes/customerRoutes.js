import express from 'express';
import {
  signup,
  login,
  logout,
  getMe,
  updateMe,
  orderJuice,
  getMyOrders,
  protect,
  restrictTo
} from '../controllers/customerController.js';

const router = express.Router();

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// Protect all routes after this middleware
router.use(protect);

// Customer profile routes
router.get('/me', getMe);
router.patch('/updateMe', updateMe);

// Order routes
router.post('/order-juice', orderJuice);
router.get('/my-orders', getMyOrders);

// Admin-only routes
router.use(restrictTo('admin'));

// Additional admin routes can be added here
// Example: router.get('/', getAllCustomers);

export default router;