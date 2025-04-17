export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  status?: 'pending' | 'completed' | 'cancelled';
}

export interface TableOrder {
  orderId?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'cancelled';
  createdAt?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  tableNumber: number;
}

export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface Table {
  _id?: string;
  number: number;
  status: TableStatus;
  customerInfo?: CustomerInfo;
  currentOrder?: TableOrder;
  orderHistory: TableOrder[];
} 