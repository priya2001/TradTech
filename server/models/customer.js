import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  resetPasswordOTP: {
    type: String
  },
  resetPasswordOTPExpiry: {
    type: Date
  },
  role: {
    type: String,
    enum: ['shopkeeper', 'admin', 'customer'], // Only allow these values
    default: 'customer' // Default role for new customers
  },
  profilePic: {
    type: String,
    default: 'default.jpg'
  },
  mobileNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  passwordChangedAt: Date,
});

// Hash password before saving
customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update updatedAt timestamp
customerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare passwords
customerSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

customerSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;