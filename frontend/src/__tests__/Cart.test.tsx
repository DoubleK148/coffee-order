import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';
import { BrowserRouter } from 'react-router-dom';
import Cart from '../pages/Cart/Cart';
import '@testing-library/jest-dom';
import { CartItem } from '../types/cart';

const mockProduct: CartItem = {
  productId: '1',
  name: 'Test Coffee',
  price: 50000,
  image: 'test.jpg',
  quantity: 1,
  note: '',
};

const MockCart = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Cart />
      </CartProvider>
    </BrowserRouter>
  );
};

describe('Cart Component', () => {
  it('should render empty cart message', () => {
    render(<MockCart />);
    expect(screen.getByText(/Giỏ hàng trống/i)).toBeInTheDocument();
  });

  it('should render cart items', () => {
    const { getByText } = render(<MockCart />);
    const { addToCart } = useCart();
    addToCart(mockProduct);

    expect(getByText(mockProduct.name)).toBeInTheDocument();
    expect(getByText(`${mockProduct.price.toLocaleString()}đ`)).toBeInTheDocument();
  });

  it('should update quantity', () => {
    const { getByTestId } = render(<MockCart />);
    const { addToCart } = useCart();
    addToCart(mockProduct);

    const increaseButton = getByTestId('increase-quantity');
    fireEvent.click(increaseButton);

    expect(getByTestId('quantity')).toHaveTextContent('2');
  });

  it('should remove item from cart', () => {
    const { getByTestId, queryByText } = render(<MockCart />);
    const { addToCart } = useCart();
    addToCart(mockProduct);

    const removeButton = getByTestId('remove-item');
    fireEvent.click(removeButton);

    expect(queryByText(mockProduct.name)).not.toBeInTheDocument();
  });

  it('should navigate to checkout', () => {
    const { getByText } = render(<MockCart />);
    const { addToCart } = useCart();
    addToCart(mockProduct);

    const checkoutButton = getByText(/Thanh toán/i);
    fireEvent.click(checkoutButton);

    expect(window.location.pathname).toBe('/checkout');
  });
}); 