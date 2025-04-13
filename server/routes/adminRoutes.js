import express from 'express';
import {
  signup,
  login,
  getPendingRegistrations,
  approveShopkeeper,
  rejectShopkeeper,
  getAllShopkeepers,
  getAllCustomers,
  getMe,
  updateMe,
  updatePassword,
  protect,
  restrictToAdmin
} from '../controllers/adminController.js';

const router = express.Router();

// Admin authentication
router.post('/signup', signup);
router.post('/login', login);

// Protect all routes after this middleware
router.use(protect);
router.use(restrictToAdmin);

// Admin profile
router.get('/me', getMe);
router.patch('/update-me', updateMe);
router.patch('/update-password', updatePassword);

// Shopkeeper management
router.get('/pending-registrations', getPendingRegistrations);
router.patch('/approve-shopkeeper/:id', approveShopkeeper);
router.delete('/reject-shopkeeper/:id', rejectShopkeeper);
router.get('/shopkeepers', getAllShopkeepers);

// Customer management
router.get('/customers', getAllCustomers);

export default router;