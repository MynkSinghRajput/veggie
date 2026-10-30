/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';


const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
});
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);

  const addToCart = (product) => {
  setCart((prevCart) => {
    const existingItem = prevCart.find(item => item.id === product.id);

    // Product is already in cart
    if (existingItem) {
      // Already reached available stock
      if (existingItem.quantity >= product.stockQuantity) {
        return prevCart;
      }

      return prevCart.map(item =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              stockQuantity: product.stockQuantity
            }
          : item
      );
    }

    // Product has no stock
    if (product.stockQuantity <= 0) {
      return prevCart;
    }

    // First item added to cart
    return [
      ...prevCart,
      {
        ...product,
        quantity: 1
      }
    ];
  });
};

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  // NEW: Function to update exact quantity
  const updateQuantity = (productId, newQuantity) => {
  if (newQuantity < 0) return;

  setCart((prevCart) => {
    if (newQuantity === 0) {
      return prevCart.filter(item => item.id !== productId);
    }

    return prevCart.map(item =>
      item.id === productId
        ? {
            ...item,
            quantity: Math.min(newQuantity, item.stockQuantity)
          }
        : item
    );
  });
};

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, // Make sure this is exported
      getCartTotal, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);