// src/components/Checkout.js
import React, { useState } from 'react';
import './checkout.css';
import { useCart } from '../contexts/CartContext';

const Checkout = () => {
  const { cart, totalAmount, updateQuantity } = useCart();
  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const handleDelete = (item) => {
    updateQuantity(item.title, item.color, -1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      address,
      items: cart,
      totalAmount,
      orderStatus: 'pending',
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'), // Ensure you include the token
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log('Order placed successfully');
      } else {
        const errorData = await response.json();
        console.log('Error placing order:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <header className="checkout-header">
        <div className="container">
          <h1>Checkout</h1>
        </div>
      </header>

      <div className="checkout-container">
        <section className="order-summary">
          <div className="order-summary-box">
            <h2>Order Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Image</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td><img src={item.image} alt={item.title} className="checkout-image" /></td>
                    <td>{item.quantity}</td>
                    <td>{item.totalPrice.toFixed(2)}</td>
                    <td>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total">
              Total: <span>INR {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="checkout-container">
        <div className="checkout-content">
          <form onSubmit={handleSubmit}>
            <div className="delivery-address">
              <h2>1. Delivery address</h2>
              <label>Enter your address:</label>
              <input type="text" name="addressLine1" className="address" placeholder="Enter your address" required onChange={handleChange} /><br /><br />
              <label>Enter your State:</label>
              <input type="text" name="state" className="address" placeholder="Enter your state" required onChange={handleChange} /><br /><br />
              <label>Enter your city:</label>
              <input type="text" name="city" className="address" placeholder="Enter your city" required onChange={handleChange} /><br /><br />
              <label>Enter the pincode:</label>
              <input type="number" name="postalCode" className="address" placeholder="Enter the pincode" required onChange={handleChange} /><br /><br />
            </div>

            <div className="payment-method">
              <h2>2. Select a payment method</h2><br />
              <label>Cash on Delivery</label><br />
              <button type="submit" className="order">Place Order</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
