import React from 'react';
import { Link } from 'react-router-dom';
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
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <img src={item.image} alt={item.title} />
              <div>
                <h2>{item.title}</h2>
                <p>{item.totalPrice.toFixed(2)}</p>
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
      {cart.length > 0 && (
        <div className="cart-total">
          <h2>Total: INR {totalAmount.toFixed(2)}</h2>
          <Link to="/checkout">
            <button className="add-to-cart-btn">CHECK OUT</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
