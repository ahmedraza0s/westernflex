import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { parseISO, differenceInDays, isValid } from 'date-fns';
import './myOrders.css';
import UserReview from './UserReview';

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
  const navigate = useNavigate(); // Add this line

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

  const handleOrderClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
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
    formData.append('color', color);

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

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/order/cancel/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, orderStatus: 'canceled' }
            : order
        )
      );
      alert('Order canceled successfully');
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Error canceling order');
    }
  };

  const handleReturnOrder = async (orderId, orderstatusdate) => {
    // Log the raw orderstatusdate for debugging
    console.log('Raw orderstatusdate:', orderstatusdate);
  
    // Check if the orderstatusdate is valid
    if (!orderstatusdate) {
      alert('Invalid order status date.');
      return;
    }
  
    // Parse the orderstatusdate using date-fns
    const deliveredDate = parseISO(orderstatusdate);
  
    // Check if the date is valid
    if (!isValid(deliveredDate)) {
      alert('Invalid order status date.');
      return;
    }
  
    // Get today's date
    const today = new Date();
  
    // Calculate the difference in days
    const daysDiff = differenceInDays(today, deliveredDate);
  
    // Log for debugging
    console.log(`Order ID: ${orderId}`);
    console.log(`Delivered Date: ${deliveredDate.toISOString()}`);
    console.log(`Today: ${today.toISOString()}`);
    console.log(`Days Difference: ${daysDiff}`);
  
    // Check if the difference is greater than 5 days
    if (daysDiff > 5) {
      alert('Return period has expired. You can only return orders within 5 days of delivery.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/order/return/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, orderStatus: 'returned' }
            : order
        )
      );
      alert('Order returned successfully');
    } catch (error) {
      console.error('Error returning order:', error);
      alert('Error returning order');
    }
  };
  
  
  

  const filteredOrders = orders.filter(order => {
    return statusFilter === 'All' || order.orderStatus.toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='order-container myOrders'>
      <h4>My Orders</h4>

      <div className='filter-options myOrders'>
        <label>Filter by Status: </label>
        <select name="status" value={statusFilter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => {
          const isDelivered = order.orderStatus.toLowerCase() === 'delivered';

          return (
            <div key={order.orderId} className='order-item myOrders'>
              <h3 onClick={() => handleOrderClick(order.orderId)}>
                Order ID: {order.orderId}
              </h3>
              {expandedOrderId === order.orderId && (
                <div className='order-item myOrders'>
                  <p>Order Number: {order.orderId}</p>
                  <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p>Order Status: {order.orderStatus}</p>
                  <button onClick={() => toggleTracking(order.orderId)} className='trackButton'>
                    {showTracking[order.orderId] ? 'Hide Tracking Details' : 'Track Order'}
                  </button>

                  {order.orderStatus.toLowerCase() === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.orderId)}
                      className='cancelButton myOrders'
                    >
                      Cancel Order
                    </button>
                  )}

                  {isDelivered && (
                    <button
                      onClick={() => handleReturnOrder(order.orderId)}
                      className='returnButton myOrders'
                    >
                      Return Order
                    </button>
                  )}

                  {showTracking[order.orderId] && (
                    <div className='tracking-container myOrders'>
                      <h4>Tracking Details</h4>
                      <div className='timeline myOrders'>
                        {order.orderHistory && order.orderHistory.length > 0 ? (
                          order.orderHistory.map((history, index) => (
                            <div key={index} className={`timeline-item myOrders ${history.status.toLowerCase() === 'delivered' ? 'delivered' : ''}`}>
                              <div className='timeline-icon myOrders'></div>
                              <div className='timeline-content myOrders'>
                                <p className='timeline-status myOrders'>{history.status}</p>
                                <p className='timeline-location myOrders'>{history.location}</p>
                                {history.status.toLowerCase() === 'delivered' && (
                                  <p className='timeline-date myOrders'>Delivered on: {new Date(history.date).toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No tracking details available.</p>
                        )}
                        {!isDelivered && order.estimatedDelivery && (
                          <div className='timeline-item myOrders'>
                            <div className='timeline-icon myOrders'></div>
                            <div className='timeline-content myOrders'>
                              <p className='timeline-status myOrders'>Estimated Delivery</p>
                              <p className='timeline-location myOrders'>{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <h4>Items</h4>
                  <ul className='items-list myOrders'>
                    {order.items.map(item => {
                      const imageKey = `${item.productId}-${item.color}`;
                      const productImage = productImages[imageKey] || '';

                      return (
                        <li key={item.productId} className='items myOrders'>
                          {item.productName} - {item.quantity} x ${item.price}
                          <div>
                            {productImage && (
                              <div className='product-image-container myOrders'>
                                <img src={productImage} alt={`Product ${item.productId} color ${item.color}`} className='product-image myOrders' />
                              </div>
                            )}
                          </div>
                          {isDelivered && (
                            <div className='review-section myOrders'>
                              <button onClick={() => setShowReviewForm((prev) => ({
                                ...prev,
                                [`${order.orderId}_${item.productId}`]: !prev[`${order.orderId}_${item.productId}`]
                              }))}>
                                {showReviewForm[`${order.orderId}_${item.productId}`] ? 'Hide Review Form' : 'Write a Review'}
                              </button>
                              {showReviewForm[`${order.orderId}_${item.productId}`] && (
                                <form onSubmit={(e) => {
                                  e.preventDefault();
                                  handleReviewSubmit(order.orderId, item.productId, item.color);
                                }}>
                                  <div className='Order id-section myOrders'>
                                    <label htmlFor={`rating_${order.orderId}_${item.productId}`}>Rating:</label>
                                    <select
                                      id={`rating_${order.orderId}_${item.productId}`}
                                      name="rating"
                                      value={reviews[order.orderId]?.[item.productId]?.rating || ''}
                                      onChange={(e) => handleReviewChange(e, order.orderId, item.productId)}
                                      required
                                    >
                                      <option value="">Select Rating</option>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                      <option value="4">4</option>
                                      <option value="5">5</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label htmlFor={`comment_${order.orderId}_${item.productId}`}>Comment:</label>
                                    <textarea
                                      id={`comment_${order.orderId}_${item.productId}`}
                                      name="comment"
                                      value={reviews[order.orderId]?.[item.productId]?.comment || ''}
                                      onChange={(e) => handleReviewChange(e, order.orderId, item.productId)}
                                      required
                                    ></textarea>
                                  </div>
                                  <div>
                                    <label htmlFor={`image_${order.orderId}_${item.productId}`}>Upload Image:</label>
                                    <input
                                      type="file"
                                      id={`image_${order.orderId}_${item.productId}`}
                                      name="image"
                                      onChange={(e) => handleReviewChange(e, order.orderId, item.productId)}
                                    />
                                  </div>
                                  <button type="submit">Submit Review</button>
                                </form>
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
        <p>No orders found.</p>
      )}

      <UserReview />
    </div>
  );
};

export default MyOrders;
