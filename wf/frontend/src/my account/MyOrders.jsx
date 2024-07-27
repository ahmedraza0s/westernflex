import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './myOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showTracking, setShowTracking] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState({});
  const [productImages, setProductImages] = useState({});
  const [showReviewForm, setShowReviewForm] = useState({});
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.orders);
        // Fetch images for all products regardless of their status
        const newProductImages = {};
        for (const order of response.data.orders) {
          for (const item of order.items) {
            const images = await fetchProductImages(item.productId, item.color);
            newProductImages[`${item.productId}-${item.color}`] = images.length > 0 ? `http://localhost:5000/${images[0]}` : '';
          }
        }
        setProductImages(newProductImages);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchProductImages = async (productId, color) => {
    try {
      const response = await axios.get(`/api/product/${productId}/${color}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product images:', error);
      return [];
    }
  };

  const handleOrderClick = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    // Expand order
    setExpandedOrderId(orderId);
  };

  const toggleTracking = (orderId) => {
    setShowTracking((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleReviewChange = (e, orderId, productId) => {
    const { name, value, files } = e.target;
    setReviews((prevReviews) => ({
      ...prevReviews,
      [orderId]: {
        ...prevReviews[orderId],
        [productId]: {
          ...prevReviews[orderId]?.[productId],
          [name]: name === 'image' ? files[0] : value,
        },
      },
    }));
  };

  const handleReviewSubmit = async (orderId, productId, color) => {
    const review = reviews[orderId]?.[productId] || {};
    const formData = new FormData();
    formData.append('rating', review.rating);
    formData.append('comment', review.comment);
    formData.append('image', review.image);
    formData.append('orderId', orderId);
    formData.append('productId', productId);
    formData.append('color', color); // Include color in the formData

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/review', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Review submitted successfully');
      setReviews((prevReviews) => ({
        ...prevReviews,
        [orderId]: {
          ...prevReviews[orderId],
          [productId]: { rating: '', comment: '', image: null },
        },
      }));
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  const filteredOrders = orders.filter(order => {
    return statusFilter === 'All' || order.orderStatus.toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='order-container'>
      <h4>My Orders</h4>

      {/* Filter options */}
      <div className='filter-options'>
        <label>Filter by Status: </label>
        <select name="status" value={statusFilter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="shipped">Shipped</option>
        </select>
      </div>

      {filteredOrders.length > 0 ? (
        filteredOrders.map((order, index) => {
          const isDelivered = order.orderHistory.some(
            (history) => history.status.toLowerCase() === 'delivered'
          );

          return (
            <div key={order.orderId}>
              <h3 onClick={() => handleOrderClick(order.orderId)}>
                Order {index + 1}
              </h3>
              {expandedOrderId === order.orderId && (
                <div>
                  <p>Order Number: {order.orderId}</p>
                  <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p>Order Status: {order.orderStatus}</p>
                  <button onClick={() => toggleTracking(order.orderId)} className='trackButton'>
                    {showTracking[order.orderId] ? 'Hide Tracking Details' : 'Track Order'}
                  </button>

                  {showTracking[order.orderId] && (
                    <div className='tracking-container'>
                      <h4>Tracking Details</h4>
                      <div className='timeline'>
                        {order.orderHistory && order.orderHistory.length > 0 ? (
                          order.orderHistory.map((history, index) => (
                            <div key={index} className={`timeline-item ${history.status.toLowerCase() === 'delivered' ? 'delivered' : ''}`}>
                              <div className='timeline-icon'></div>
                              <div className='timeline-content'>
                                <p className='timeline-status'>{history.status}</p>
                                <p className='timeline-location'>{history.location}</p>
                                {history.status.toLowerCase() === 'delivered' && (
                                  <p className='timeline-date'>Delivered on: {new Date(history.date).toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No tracking details available.</p>
                        )}
                        {!isDelivered && order.estimatedDelivery && (
                          <div className='timeline-item'>
                            <div className='timeline-icon'></div>
                            <div className='timeline-content'>
                              <p className='timeline-status'>Estimated Delivery</p>
                              <p className='timeline-location'>{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <h4>Items</h4>
                  <ul>
                    {order.items.map(item => {
                      const imageKey = `${item.productId}-${item.color}`;
                      const productImage = productImages[imageKey] || '';

                      return (
                        <li key={item.productId}>
                          {item.productName} - {item.quantity} x ${item.price}
                          <div>
                            {productImage && (
                              <div>
                                <img src={productImage} alt={`Product ${item.productId} color ${item.color}`} className='product-image' />
                              </div>
                            )}
                          </div>
                          {isDelivered && (
                            <div>
                              <button onClick={() => setShowReviewForm((prev) => ({
                                ...prev,
                                [`${order.orderId}_${item.productId}`]: !prev[`${order.orderId}_${item.productId}`]
                              }))}>
                                {showReviewForm[`${order.orderId}_${item.productId}`] ? 'Hide Review Form' : 'Submit a Review'}
                              </button>
                              {showReviewForm[`${order.orderId}_${item.productId}`] && (
                                <div>
                                  <form onSubmit={(e) => { e.preventDefault(); handleReviewSubmit(order.orderId, item.productId, item.color); }}>
                                    <div>
                                      <label>Rating: </label>
                                      <input
                                        type="number"
                                        name="rating"
                                        value={reviews[order.orderId]?.[item.productId]?.rating || ''}
                                        onChange={(e) => handleReviewChange(e, order.orderId, item.productId)}
                                        min="1"
                                        max="5"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label>Comment: </label>
                                      <textarea
                                        name="comment"
                                        value={reviews[order.orderId]?.[item.productId]?.comment || ''}
                                        onChange={(e) => handleReviewChange(e, order.orderId, item.productId)}
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label>Image: </label>
                                      <input
                                        type="file"
                                        name="image"
                                        onChange={(e) => handleReviewChange(e, order.orderId, item.productId)}
                                        accept="image/*"
                                      />
                                    </div>
                                    <button type="submit">Submit Review</button>
                                  </form>
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default MyOrders;
