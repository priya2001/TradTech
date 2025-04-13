import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';

export const protectCustomer = async (req, res, next) => {
    console.log("Inside customer middleware");
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, please login again' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customer = await Customer.findById(decoded.id).select('-password');

        if (!customer) {
            return res.status(404).json({ 
                success: false, 
                message: 'Customer not found' 
            });
        }

        req.customer = customer;
        console.log("Customer authenticated, proceeding to route");
        next();

    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, token failed' 
        });
    }
};