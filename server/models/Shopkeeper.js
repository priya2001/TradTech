import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const shopkeeperSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    shopName: {
        type: String,
        required: [true, 'Please provide your shop name'],
        unique: true,
        trim: true,
        maxlength: [100, 'Shop name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    resetPasswordOTP: {
        type: String
      },
      resetPasswordOTPExpiry: {
        type: Date
      },
    profilePic: {
        type: String,
        default: 'default.jpg'
    },
    mobileNumber: {
        type: String,
        required: [true, 'Please provide your mobile number'],
        validate: {
            validator: function (v) {
                return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        location: {
          type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],  // Must be an array of numbers
            required: [true, 'Coordinates are required']
          }
        }
      },
    licenseNumber: {
        type: String,
        required: [true, 'Please provide your business license number'],
        unique: true
    },
    passwordChangedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    role: {
        type: String,
        enum: ['shopkeeper', 'admin', 'customer'], // Only allow these values
        default: 'shopkeeper' // Default role for new customers
      }
});

// Index for geospatial queries
shopkeeperSchema.index({ 'address.location': '2dsphere' });

// Hash password before saving
shopkeeperSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Update passwordChangedAt when password is modified
shopkeeperSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000; // Ensure token is created after
    next();
});

// Method to check if password was changed after token was issued
shopkeeperSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Method to verify password
shopkeeperSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const Shopkeeper = mongoose.model('Shopkeeper', shopkeeperSchema);

export default Shopkeeper;