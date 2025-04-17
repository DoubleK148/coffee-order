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

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  tableNumber: number;
}

export interface Table {
  _id: Types.ObjectId;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  location: 'indoor' | 'outdoor';
  customerInfo?: CustomerInfo;
  currentOrder: TableOrder | null;
  orderHistory: TableOrder[];
} 