import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ReturnOrder = () => {
  const { orderId } = useParams(); // Get the orderId from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`/api/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log('Order data:', response.data); // Debugging line
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err); // Debugging line
        setError(err.response ? err.response.data.error : 'Error fetching order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleReturnRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.post(`/api/order/return/${orderId}`, { reason: returnReason }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Return request submitted successfully');
    } catch (error) {
      console.error('Error submitting return request:', error); // Debugging line
      alert('Error submitting return request');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='return-order-container'>
      <h2>Return Order</h2>
      {order ? (
        <div>
          <h3>Order ID: {order.orderId}</h3>
          <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
          <p>Order Status: {order.orderStatus}</p>
          
          <h4>Items</h4>
          <ul>
            {order.items.map(item => (
              <li key={item.productId}>
                <p>Product: {item.productName}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
              </li>
            ))}
          </ul>

          <div>
            <label htmlFor='returnReason'>Return Reason:</label>
            <textarea
              id='returnReason'
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              rows="4"
              cols="50"
              required
            />
          </div>

          <button onClick={handleReturnRequest}>Submit Return Request</button>
        </div>
      ) : (
        <p>No order found.</p>
      )}
    </div>
  );
};

export default ReturnOrder;
