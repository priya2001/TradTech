import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Order must belong to a customer']
  },
  juice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SugarcaneJuice',
    required: [true, 'Order must be for a juice product']
  },
  orderedQuantity: {
    volume: {
      type: Number,
      required: [true, 'Must specify volume ordered'],
      min: [100, 'Minimum volume is 100ml']
    },
    price: {
      type: Number,
      required: [true, 'Must specify price per unit']
    },
    quantity: {
      type: Number,
      required: [true, 'Must specify number of units'],
      min: [1, 'Minimum order quantity is 1']
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Order must have a total amount']
  },
  deliveryAddress: {
    type: String,
    // required: [true, 'Delivery address is required']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      message: 'Status is either: pending, processing, shipped, delivered, or cancelled'
    },
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    required: [true, 'Payment method is required']
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
  deliveredAt: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  this.totalAmount = this.orderedQuantity.price * this.orderedQuantity.quantity;
  next();
});

// Populate customer and juice details when querying
orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'customer',
    select: 'name email mobileNumber'
  }).populate({
    path: 'juice',
    select: 'name'
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;