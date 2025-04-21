import express from "express";
import { verifyToken, updateProfile } from "../controllers/authController.js"; // import updateProfile

const router = express.Router();

// ✅ Get user profile
router.get('/me', verifyToken);

// ✅ Update user profile
router.put('/update-profile', verifyToken, updateProfile);  // <-- New route added

export default router;
