import express from 'express';
import {
  signup,
  login,
  logout,
  protect,
  updateLocation,
  getMe,
  updateMe,
  updatePassword,
  deactivateAccount
} from '../controllers/shopkeeperController.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (require valid JWT token)
router.use(protect);

router.get('/logout', logout);
router.get('/me', getMe);
router.patch('/update-me', updateMe);
router.patch('/update-location', updateLocation);
router.patch('/update-password', updatePassword);
router.delete('/deactivate', deactivateAccount);

export default router;