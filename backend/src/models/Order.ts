import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    note: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'completed', 'cancelled', 'payment_failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'momo'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: String,
  paymentDetails: {
    payType: String,
    transId: String,
    responseTime: String,
    message: String,
    resultCode: String
  },
  note: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware để tự động cập nhật updatedAt
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order; 