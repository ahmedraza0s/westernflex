import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productIdFilter, setProductIdFilter] = useState('');
  const [filteredReviews, setFilteredReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews'); // Fetch all reviews from your API
        setReviews(response.data || []);
        setFilteredReviews(response.data || []);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleFilterChange = (e) => {
    setProductIdFilter(e.target.value);
  };

  const handleFilterSubmit = () => {
    if (productIdFilter) {
      const filtered = reviews.filter(
        review => review && review.productId && review.productId.toString() === productIdFilter
      );
      setFilteredReviews(filtered);
    } else {
      setFilteredReviews(reviews);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>All User Reviews</h2>
      <div>
        <input
          type="text"
          placeholder="Enter Product ID to filter"
          value={productIdFilter}
          onChange={handleFilterChange}
        />
        <button onClick={handleFilterSubmit}>Filter Reviews</button>
      </div>
      {filteredReviews.length > 0 ? (
        filteredReviews.map((review, index) => (
          // Ensure the review is not null and has the expected properties
          review && review.productId && review.rating && review.comment ? (
            <div key={index}>
              <h3>Product ID: {review.productId}</h3>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
              {review.imageUrl && (
                <div>
                  <img
                    src={`http://localhost:5000${review.imageUrl}`}
                    alt={`Review for Product ID: ${review.productId}`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                    onError={(e) => e.target.src = 'https://example.com/path/to/placeholder-image.jpg'}
                  />
                </div>
              )}
              <p>Review Date: {new Date(review.reviewDate).toLocaleDateString()}</p>
            </div>
          ) : (
            <div key={index}>Invalid review data</div>
          )
        ))
      ) : (
        <p>No reviews found.</p>
      )}
    
    </div>
  );
};

export default AllReviews;

