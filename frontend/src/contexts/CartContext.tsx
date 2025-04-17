import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CartItem, CartState, CartContextType } from '../types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

// Validate cart item
const validateCartItem = (item: CartItem): boolean => {
  return !!(item.productId && item.name && typeof item.quantity === 'number' && typeof item.price === 'number');
};

// Ensure all required fields are present
const sanitizeCartItem = (item: CartItem): CartItem => {
  return {
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    note: item.note || ''
  };
};

const cartReducer = (state: CartState, action: any) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      // Validate new item
      if (!validateCartItem(action.item)) {
        console.error('Invalid cart item:', action.item);
        return state;
      }

      const sanitizedItem = sanitizeCartItem(action.item);
      const existingItemIndex = state.items.findIndex(
        item => item.productId === sanitizedItem.productId
      );

      let newState: CartState;
      if (existingItemIndex > -1) {
        // Update existing item
        const updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });

        newState = {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
      } else {
        // Add new item
        newState = {
          items: [...state.items, sanitizedItem],
          total: state.total + sanitizedItem.price
        };
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    }

    case 'LOAD_CART': {
      // Validate and sanitize all items
      const validItems = action.items
        .filter(validateCartItem)
        .map(sanitizeCartItem);

      const newState = {
        items: validItems,
        total: validItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
      };

      // Update localStorage with sanitized data
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
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
          return sanitizeCartItem({ ...item, quantity: action.quantity });
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
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          // Validate and sanitize items before loading
          const validItems = parsedCart.items
            .filter(validateCartItem)
            .map(sanitizeCartItem);

          dispatch({ 
            type: 'LOAD_CART', 
            items: validItems
          });
        }
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      localStorage.removeItem('cart');
    }
  }, []);

  const addToCart = (item: CartItem) => {
    if (!validateCartItem(item)) {
      console.error('Invalid item:', item);
      toast.error('Không thể thêm sản phẩm vào giỏ hàng');
      return;
    }
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