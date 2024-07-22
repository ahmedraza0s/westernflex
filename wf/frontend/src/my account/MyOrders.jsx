// src/components/MyOrders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store your JWT in localStorage
        const response = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.orders);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        orders.map(order => (
          <div key={order.orderId}>
            <h3>Order ID: {order.orderId}</h3>
            <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
            <p>Order Status: {order.orderStatus}</p>
            <h4>Items</h4>
            <ul>
              {order.items.map(item => (
                <li key={item.productId}>
                  {item.productName} - {item.quantity} x ${item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;
