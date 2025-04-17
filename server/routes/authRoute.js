import express from "express";
import { verifyToken } from "../controllers/authController.js"; // <-- Add `.js`

const router = express.Router();

router.get('/me', verifyToken);

export default router;
