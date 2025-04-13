import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import customerRoutes from './routes/customerRoutes.js';
import shopkeeperRoutes from './routes/shopkeeperRoutes.js';
import adminRouter from './routes/adminRoutes.js';



// initiaze express
const app = express()

// Increase the limit for MongoDB listeners
mongoose.connection.setMaxListeners(20); // Default is 10
// connect to database
await connectDB()
await connectCloudinary();

// MiddleWares
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    credentials: true, // Allow cookies/authorization headers
  })
);
app.use(express.json())


// Routes
app.get('/',(req,res) => res.send("API working"));
app.use('/api/customers', customerRoutes);
app.use('/api/shopkeepers', shopkeeperRoutes);
app.use('/api/admin', adminRouter);


// port
const PORT = process.env.PORT || 3000



const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT,()=>{
      console.log(`Server is running on ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
