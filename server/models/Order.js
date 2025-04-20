import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shopkeeper', 
    required: true
  },
  glassSize: {
    type: Number,
    enum: [250, 500], // Only 250ml or 500ml
    required: true
  },
  quantity: {
    type: Number,
    min: 1,
    required: true
  },
  pricePerGlass: { // Price based on glassSize (set by shop)
    type: Number,
    default:40,
    required: true
  },
  totalAmount: { // Auto-calculated (pricePerGlass × quantity)
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'picked-up', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderedAt: {
    type: Date,
    default: Date.now
  },
  readyAt: Date,
  pickedUpAt: Date
});

// Populate customer, shop, and juice details when querying
orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'customer',
    select: 'name email mobileNumber'
  }).populate({
    path: 'shop',
    select: 'shopName address mobileNumber' // Include shop details you want to show
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;