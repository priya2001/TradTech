// controllers/authController.js
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Shopkeeper from "../models/Shopkeeper.js";
import Customer from "../models/customer.js";

// ✅ Existing: Verify token and get user
export const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log("come");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try finding user in all 3 collections
    const [admin, customer, shopkeeper] = await Promise.all([
      Admin.findById(decoded.id),
      Customer.findById(decoded.id),
      Shopkeeper.findById(decoded.id).select('+active'),
    ]);

    const user = admin || customer || shopkeeper;
    console.log(user);
    console.log("server");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach id to request object for updateProfile use
    req.userId = decoded.id;

    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ New: Update user profile
export const updateProfile = async (req, res) => {
  console.log("updateProfile called");
  console.log("Received userId:", req.userId);
  console.log("Request Body:", req.body);
  const { name, email } = req.body;
  const userId = req.userId;

  try {
    // Try finding user in all 3 collections
    const [admin, customer, shopkeeper] = await Promise.all([
      Admin.findById(userId),
      Customer.findById(userId),
      Shopkeeper.findById(userId),
    ]);

    const user = admin || customer || shopkeeper;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
