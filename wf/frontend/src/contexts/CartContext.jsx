import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.title === product.title);

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        updatedCart[existingProductIndex].totalPrice += parseFloat(product.price);
        return updatedCart;
      }

      return [...prevCart, { ...product, quantity: 1, totalPrice: parseFloat(product.price) }];
    });
  };

  const updateQuantity = (title, amount) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.title === title) {
          const newQuantity = item.quantity + amount;
          const newTotalPrice = newQuantity * parseFloat(item.price);
          return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
        }
        return item;
      }).filter(item => item.quantity > 0); // Remove items with 0 quantity
    });
  };

  const cartCount = cart.length;
  const totalAmount = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, cartCount, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};
