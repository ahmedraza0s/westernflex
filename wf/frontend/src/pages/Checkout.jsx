import React from 'react';
import './checkout.css';

const Checkout = () => {
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
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Product 1</td>
                  <td>1</td>
                  <td>$10.00</td>
                </tr>
                <tr>
                  <td>Product 2</td>
                  <td>2</td>
                  <td>$20.00</td>
                </tr>
                <tr>
                  <td>Product 3</td>
                  <td>1</td>
                  <td>$30.00</td>
                </tr>
              </tbody>
            </table>
            <div className="total">
              Total: <span>$60.00</span>
            </div>
          </div>
        </section>
      </div>

      <div className="checkout-container">
        <div className="checkout-content">
          <div className="delivery-address">
            <h2>1. Delivery address</h2>
            <h>Enter your address:</h>
            <input type="text" className="address" placeholder="Enter your address" required /><br /><br />
            <h>Enter your State:</h>
            <input type="text" className="address" placeholder="Enter your state" required /><br /><br />
            <h>Enter your city:</h>
            <input type="text" className="address" placeholder="Enter your city" required /><br /><br />
            <h>Enter the pincode:</h>
            <input type="number" className="address" placeholder="Enter the pincode" required /><br /><br />
          </div>

            <div className="payment-method">

            <h2>2. Select a payment method</h2><br></br>
           
               <h>Cash on Delivery</h><br></br>
        
            <button className="order">Place Order</button>
          </div>
        </div>
      </div>
  
    </div>
  );
};

export default Checkout;
