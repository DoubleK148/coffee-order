import { Types } from 'mongoose';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  status: 'pending' | 'paid';
}

export interface TableOrder {
  orderId: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid';
  createdAt: Date;
}

export interface Table {
  _id: Types.ObjectId;
  number: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder: TableOrder | null;
  orderHistory: TableOrder[];
} 