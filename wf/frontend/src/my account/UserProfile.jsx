// src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store your JWT in localStorage
        const response = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Phone Number: {user.phno}</p>
      
      <h2>Orders</h2>
      {user.orders.length > 0 ? (
        user.orders.map(order => (
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

export default UserProfile;
