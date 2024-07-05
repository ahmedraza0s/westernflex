import React from 'react';
import './checkout.css';
import { useCart } from '../contexts/CartContext';

const Checkout = () => {
  const { cart, totalAmount } = useCart();

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
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td><img src={item.image} alt={item.title} className="checkout-image" /></td>
                    <td>{item.quantity}</td>
                    <td>{item.totalPrice.toFixed(2)}</td>
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
          <div className="delivery-address">
            <h2>1. Delivery address</h2>
            <label>Enter your address:</label>
            <input type="text" className="address" placeholder="Enter your address" required /><br /><br />
            <label>Enter your State:</label>
            <input type="text" className="address" placeholder="Enter your state" required /><br /><br />
            <label>Enter your city:</label>
            <input type="text" className="address" placeholder="Enter your city" required /><br /><br />
            <label>Enter the pincode:</label>
            <input type="number" className="address" placeholder="Enter the pincode" required /><br /><br />
          </div>

          <div className="payment-method">
            <h2>2. Select a payment method</h2><br />
            <label>Cash on Delivery</label><br />
            <button className="order">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Checkout;
