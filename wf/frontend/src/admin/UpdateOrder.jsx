import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    orderStatus: '',
    estimatedDelivery: '',
    items: [],
    orderHistory: [],
    user: { fname: '', lname: '', username: '' } // Initialize user details
  });
  const [newHistoryEntry, setNewHistoryEntry] = useState({
    status: '',
    location: ''
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`/api/admin/orders/${orderId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { orderStatus, estimatedDelivery, orderHistory, items, user } = response.data.order;
          setOrderDetails({
            orderStatus,
            estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery).toISOString().split('T')[0] : '',
            items: items || [],
            orderHistory: orderHistory || [],
            user: user || { fname: '', lname: '', username: '' } // Default user details
          });
        } catch (error) {
          console.error('Error fetching order details:', error);
          alert('Order not found or an error occurred.');
        }
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleHistoryChange = (e) => {
    const { name, value } = e.target;
    setNewHistoryEntry({ ...newHistoryEntry, [name]: value });
  };

  const addHistoryEntry = () => {
    setOrderDetails({
      ...orderDetails,
      orderHistory: [...orderDetails.orderHistory, { ...newHistoryEntry, date: new Date() }]
    });
    setNewHistoryEntry({
      status: '',
      location: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/orders/${orderId}`, {
        ...orderDetails,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-update-container">
      <h2>Update Order</h2>
      <div>
        <label>Order ID:</label>
        <input
          type="text"
          name="orderId"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
        <button type="button" onClick={() => setOrderId(orderId)}>Fetch Order</button>
      </div>
      {orderDetails && (
        <div className="order-details">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Status:</strong>
            <input
              type="text"
              name="orderStatus"
              value={orderDetails.orderStatus}
              onChange={handleInputChange}
            />
          </p>
          <p><strong>Order Date:</strong> {new Date(orderDetails.orderDate).toLocaleDateString()}</p>
          <p><strong>Estimated Delivery Date:</strong>
            <input
              type="date"
              name="estimatedDelivery"
              value={orderDetails.estimatedDelivery}
              onChange={handleInputChange}
            />
          </p>
          <p><strong>User Name:</strong> {orderDetails.user.fname} {orderDetails.user.lname}</p>
          <p><strong>Username:</strong> {orderDetails.user.username}</p>
          <h4>Order Items</h4>
          <ul>
            {orderDetails.items && orderDetails.items.map(item => (
              <li key={item.productId}>
                <p><strong>Product Name:</strong> {item.productName}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Price:</strong> {item.price}</p>
                <p><strong>Color:</strong> {item.color}</p>
              </li>
            ))}
          </ul>
          <h4>Order History</h4>
          <ul>
            {orderDetails.orderHistory && orderDetails.orderHistory.map((history, index) => (
              <li key={index}>
                <p><strong>Status:</strong> {history.status}</p>
                <p><strong>Location:</strong> {history.location}</p>
                <p><strong>Date:</strong> {new Date(history.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
          <div>
            <label>Status:</label>
            <input
              type="text"
              name="status"
              value={newHistoryEntry.status}
              onChange={handleHistoryChange}
            />
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={newHistoryEntry.location}
              onChange={handleHistoryChange}
            />
          </div>
          <button type="button" onClick={addHistoryEntry}>Add History Entry</button>
          <button type="submit">Update Order</button>
        </div>
      )}
    </form>
  );
};

export default UpdateOrder;
