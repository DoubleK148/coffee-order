export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  address?: string;
}

export interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  isAvailable: boolean;
}

export interface ReservationData {
  tableId: string;
  date: string;
  time: string;
  guests: number;
  note?: string;
  name: string;
  phone: string;
  email: string;
  userId?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface TableItem {
  _id: string;
  number: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder: {
    orderId: string;
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
    orderId: string;
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