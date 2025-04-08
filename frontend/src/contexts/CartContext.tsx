import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CartItem, CartState, CartContextType } from '../types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cartReducer = (state: CartState, action: any) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.item.productId
      );

      if (existingItemIndex > -1) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        const updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });

        const newState = {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
        localStorage.setItem('cart', JSON.stringify(newState));
        return newState;
      } else {
        // Nếu là sản phẩm mới
        const newState = {
          items: [...state.items, { ...action.item, quantity: 1 }],
          total: state.total + action.item.price
        };
        localStorage.setItem('cart', JSON.stringify(newState));
        return newState;
      }
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.productId !== action.productId);
      const newState = {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item => {
        if (item.productId === action.productId) {
          return { ...item, quantity: action.quantity };
        }
        return item;
      });
      const newState = {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    }

    case 'CLEAR_CART': {
      localStorage.removeItem('cart');
      return { items: [], total: 0 };
    }

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: 'LOAD_CART', ...parsedCart });
    }
  }, []);

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', item });
    toast.success('Đã thêm vào giỏ hàng!');
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });
    toast.info('Đã xóa khỏi giỏ hàng');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 