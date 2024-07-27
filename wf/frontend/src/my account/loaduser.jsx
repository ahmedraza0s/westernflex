import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Loaduser = () => {
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

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted review from the state
      setUser(prevUser => ({
        ...prevUser,
        reviews: prevUser.reviews.filter(review => review.reviewId !== reviewId)
      }));
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error deleting review');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const imageBaseURL = 'http://localhost:5000'; // Adjust to your backend's base URL

  return (
    <div>
      <h1>Welcome, {user.fname} {user.lname}</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Phone Number: {user.phno}</p>

      <h2>Reviews</h2>
      {user.reviews.length > 0 ? (
        user.reviews.map(review => (
          <div key={review.reviewId}>
            <h3>Product ID: {review.productId}</h3>
            <p>Rating: {review.rating}</p>
            <p>Comment: {review.comment}</p>
            {review.imageUrl && (
              <div>
                <img 
                  src={`${imageBaseURL}${review.imageUrl}`} 
                  alt={`Review for Product ID: ${review.productId}`} 
                  style={{ maxWidth: '100%', height: 'auto' }} 
                  onError={(e) => e.target.src = 'https://example.com/path/to/placeholder-image.jpg'} 
                />
              </div>
            )}
            <p>Review Date: {new Date(review.reviewDate).toLocaleDateString()}</p>
            <button onClick={() => handleDeleteReview(review.reviewId)}>Delete Review</button>
          </div>
        ))
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
};

export default Loaduser;
