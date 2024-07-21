import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const initialCart = JSON.parse(localStorage.getItem('cart')) || [];
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.title === product.title && item.color === product.color
      );

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        updatedCart[existingProductIndex].totalPrice += parseFloat(product.sellingPrice);
        return updatedCart;
      }

      return [
        ...prevCart,
        { ...product, quantity: 1, totalPrice: parseFloat(product.sellingPrice) },
      ];
    });
  };

  const updateQuantity = (title, color, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.title === title && item.color === color) {
            const newQuantity = item.quantity + amount;
            const newTotalPrice = newQuantity * parseFloat(item.sellingPrice);
            return newQuantity > 0 ? { ...item, quantity: newQuantity, totalPrice: newTotalPrice } : null;
          }
          return item;
        })
        .filter((item) => item !== null)
    );
  };

  const removeFromCart = (title, color) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.title === title && item.color === color)
      )
    );
  };

  const cartCount = cart.length;
  const totalAmount = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, cartCount, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};
