export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  note?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface CartContextType {
  state: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
} 