import mongoose, { Schema, Document } from 'mongoose';

interface ITable extends Document {
  number: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder: {
    orderId: mongoose.Types.ObjectId;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      status: 'pending' | 'paid';
    }>;
    totalAmount: number;
    paymentStatus: 'pending' | 'paid';
    createdAt: Date;
  } | null;
  orderHistory: Array<{
    orderId: mongoose.Types.ObjectId;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      status: 'pending' | 'paid';
    }>;
    totalAmount: number;
    paymentStatus: 'pending' | 'paid';
    createdAt: Date;
  }>;
}

const tableSchema = new Schema({
  number: { type: Number, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'reserved'],
    default: 'available'
  },
  currentOrder: {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    items: [{
      name: String,
      quantity: Number,
      price: Number,
      status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
      }
    }],
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
  },
  orderHistory: [{
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    items: [{
      name: String,
      quantity: Number,
      price: Number,
      status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
      }
    }],
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
  }]
});

export const Table = mongoose.model<ITable>('Table', tableSchema); 