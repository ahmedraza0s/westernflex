import React from 'react';
import { useCart } from '../contexts/CartContext';
import './cart.css'; // Ensure this CSS file doesn't have global styles that interfere

const Cart = () => {
  const { cart } = useCart();

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <img src={item.image} alt={item.title} />
              <div>
                <h2>{item.title}</h2>
                <p>{item.price}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
