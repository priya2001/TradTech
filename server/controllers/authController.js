// controllers/authController.js
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Shopkeeper from "../models/Shopkeeper.js";
import Customer from "../models/customer.js";

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

    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
