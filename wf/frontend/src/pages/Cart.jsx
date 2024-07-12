// components/Cart.js
import React from 'react';
import { useCart } from '../contexts/CartContext';
import './cart.css';

const Cart = () => {
  const { cart, updateQuantity, totalAmount } = useCart();

  const incrementQuantity = (title, color) => {
    updateQuantity(title, color, 1);
  };

  const decrementQuantity = (title, color) => {
    updateQuantity(title, color, -1);
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <div className="cart-items-wrapper">
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul className="cart-items">
            {cart.map((item, index) => (
              <li key={index}>
                <img src={item.image} alt={item.title} />
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.totalPrice ? item.totalPrice.toFixed(2) : "0.00"}</p>
                  <div className="cart-item-quantity">
                    <button onClick={() => decrementQuantity(item.title, item.color)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => incrementQuantity(item.title, item.color)}>+</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {cart.length > 0 && (
        <div className="cart-total">
          <h2>Total: INR {totalAmount.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default Cart;
