import React, { useState } from 'react';
import axios from 'axios';

const ReturnOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderId || !phoneNumber || !reason) {
      setError('All fields are required');
      return;
    }

    try {
      setError('');
      const response = await axios.post('/api/return-order', {
        orderId,
        phoneNumber,
        reason
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('Error submitting return order:', error);
      setMessage('');
      setError('An error occurred while submitting your return request. Please try again.');
    }
  };

  return (
    <div>
      <h1>Return Order</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="orderId">Order ID:</label>
          <input
            type="text"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="reason">Reason for Return:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Return Request</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ReturnOrder;
