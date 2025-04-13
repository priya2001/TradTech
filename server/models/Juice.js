import mongoose from 'mongoose';

const juiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A juice must have a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Juice name must have less or equal than 50 characters'],
    minlength: [3, 'Juice name must have more or equal than 3 characters']
  },
  description: {
    type: String,
    required: [true, 'A juice must have a description'],
    trim: true
  },
  basePrice: {
    type: Number,
    required: [true, 'A juice must have a base price']
  },
  variants: [
    {
      size: {
        type: String,
        required: [true, 'Variant must have a size (e.g., 30ml, 60ml)'],
        enum: {
          values: ['10ml', '30ml', '60ml', '100ml', '120ml'],
          message: 'Size is either: 10ml, 30ml, 60ml, 100ml, 120ml'
        }
      },
      price: {
        type: Number,
        required: [true, 'Variant must have a price']
      },
      quantityInStock: {
        type: Number,
        required: [true, 'Variant must have stock quantity'],
        min: [0, 'Stock cannot be negative']
      }
    }
  ],
  flavorProfile: {
    type: String,
    required: [true, 'Juice must have a flavor profile'],
    enum: {
      values: ['fruity', 'dessert', 'tobacco', 'menthol', 'beverage'],
      message: 'Flavor profile must be: fruity, dessert, tobacco, menthol, or beverage'
    }
  },
  nicotineStrengths: {
    type: [Number],
    required: [true, 'Juice must have available nicotine strengths'],
    validate: {
      validator: function(values) {
        return values.every(val => val >= 0 && val <= 50);
      },
      message: 'Nicotine strength must be between 0-50mg'
    }
  },
  imageCover: {
    type: String,
    required: [true, 'Juice must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  averageRating: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
juiceSchema.index({ basePrice: 1 });
juiceSchema.index({ name: 'text', description: 'text' });

// Virtual populate reviews (if you have a review system)
juiceSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'juice',
  localField: '_id'
});

// Pre-save hook to ensure at least one variant exists
juiceSchema.pre('save', function(next) {
  if (this.variants.length === 0) {
    this.variants.push({
      size: '30ml',
      price: this.basePrice,
      quantityInStock: 10
    });
  }
  next();
});

const Juice = mongoose.model('Juice', juiceSchema);

export default Juice;