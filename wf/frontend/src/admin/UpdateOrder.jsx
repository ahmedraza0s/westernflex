// src/admin/UpdateOrder.js
import React, { useState } from 'react';
import axios from 'axios';

const UpdateOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [historyStatus, setHistoryStatus] = useState('');
  const [historyLocation, setHistoryLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(response.data.order);
      setOrderStatus(response.data.order.orderStatus);
      setEstimatedDelivery(response.data.order.estimatedDelivery ? new Date(response.data.order.estimatedDelivery).toISOString().split('T')[0] : '');
      setHistoryStatus('');
      setHistoryLocation('');
      setError('');
    } catch (err) {
      console.error('Error fetching order', err);
      setError('Order not found or an error occurred.');
      setOrder(null);
    }
  };

  const updateOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/orders/${orderId}`, {
        orderStatus,
        estimatedDelivery,
        historyStatus,
        historyLocation,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Order updated successfully.');
      setError('');
    } catch (err) {
      console.error('Error updating order', err);
      setError('Failed to update order.');
      setSuccess('');
    }
  };

  return (
    <div className="order-update-container">
      <h2>Update Order</h2>
      <div>
        <label>Order ID:</label>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
        <button onClick={fetchOrder}>Fetch Order</button>
      </div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {order && (
        <div className="order-details">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Status:</strong>
            <input
              type="text"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            />
          </p>
          <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
          <p><strong>Estimated Delivery Date:</strong>
            <input
              type="date"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
            />
          </p>
          <h4>Update Order History</h4>
          <div>
            <label>Status:</label>
            <input
              type="text"
              value={historyStatus}
              onChange={(e) => setHistoryStatus(e.target.value)}
            />
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              value={historyLocation}
              onChange={(e) => setHistoryLocation(e.target.value)}
            />
          </div>
          <button onClick={updateOrder}>Update Order</button>
        </div>
      )}
    </div>
  );
};

export default UpdateOrder;
