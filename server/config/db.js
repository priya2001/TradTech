import mongoose from "mongoose";

// Function to connect to mongoDb database
const connectDB = async() => {
  mongoose.connection.on('connected',() =>{
    console.log("Database connected.")
  })

  await mongoose.connect(`${process.env.MONGODB_URI}/E-Juice`)
}

export default connectDB