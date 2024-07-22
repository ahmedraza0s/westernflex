// src/components/MyOrders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track expanded order
  const [showTracking, setShowTracking] = useState({}); // Track visibility of tracking details
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

  const handleOrderClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const toggleTracking = (orderId) => {
    setShowTracking((prev) => ({
      ...prev,
      [orderId]: !prev[orderId], // Toggle visibility for the specific order
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={order.orderId}>
            <h3 onClick={() => handleOrderClick(order.orderId)}>
              Order {index + 1}
            </h3>
            {expandedOrderId === order.orderId && (
              <div>
                <p>Order Number: {order.orderId}</p>
                <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p>Order Status: {order.orderStatus}</p>
                <button onClick={() => toggleTracking(order.orderId)}>
                  {showTracking[order.orderId] ? 'Hide Tracking Details' : 'Track Order'}
                </button>
                
                {showTracking[order.orderId] && (
                  <div>
                    <h4>Tracking Details</h4>
                    {order.tracking && order.tracking.length > 0 ? (
                      <ul>
                        {order.tracking.map((track, index) => (
                          <li key={index}>
                            {track.status} - {new Date(track.date).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No tracking details available.</p>
                    )}
                  </div>
                )}

                <h4>Items</h4>
                <ul>
                  {order.items.map(item => (
                    <li key={item.productId}>
                      {item.productName} - {item.quantity} x ${item.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;
