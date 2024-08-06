import React, { useState } from 'react';
import axios from 'axios';

const ReturnOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reason, setReason] = useState('');
  const [images, setImages] = useState({ image1: null, image2: null, image3: null });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setImages(prevImages => ({
      ...prevImages,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderId || !phoneNumber || !reason) {
      setError('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('phoneNumber', phoneNumber);
    formData.append('reason', reason);

    if (images.image1) formData.append('image1', images.image1);
    if (images.image2) formData.append('image2', images.image2);
    if (images.image3) formData.append('image3', images.image3);

    try {
      setError('');
      const response = await axios.post('/api/return-order', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
        <div>
          <label htmlFor="image1">Upload Image 1:</label>
          <input
            type="file"
            id="image1"
            name="image1"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <label htmlFor="image2">Upload Image 2:</label>
          <input
            type="file"
            id="image2"
            name="image2"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <label htmlFor="image3">Upload Image 3:</label>
          <input
            type="file"
            id="image3"
            name="image3"
            accept="image/*"
            onChange={handleImageChange}
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
