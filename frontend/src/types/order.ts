export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  note?: string;
}

export interface OrderUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Order {
  _id: string;
  userId: {
    _id: string;
    email: string;
    fullName: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'momo' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed';
  note?: string;
  createdAt: string;
  updatedAt: string;
} 