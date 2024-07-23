import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './productDetails.css';
import { useCart } from '../contexts/CartContext';
import offerTag from '../components/assets/offer.png';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, title, description, listingPrice, sellingPrice, details, about, images, color, allColors, productId } = location.state;
  const { addToCart } = useCart();
  const [mainImage, setMainImage] = useState(`http://localhost:5000/${image}`);
  const [selectedColorImages, setSelectedColorImages] = useState(images);
  const [selectedColor, setSelectedColor] = useState(color);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewImage, setReviewImage] = useState(null);

  const handleAddToCart = () => {
    addToCart({
      image: mainImage,
      title,
      description,
      listingPrice,
      sellingPrice,
      details,
      about,
      images: selectedColorImages,
      color: selectedColor,
      productId,
    });
  };

  const handleBuyNow = () => {
    const product = {
      image: mainImage,
      title,
      description,
      listingPrice,
      sellingPrice,
      details,
      about,
      images: selectedColorImages,
      color: selectedColor,
      productId,
    };

    if (localStorage.getItem('token')) {
      addToCart(product);
      navigate('/checkout');
    } else {
      localStorage.setItem('pendingProduct', JSON.stringify(product));
      navigate('/register');
    }
  };

  const handleColorChange = (colorImages, colorName) => {
    setSelectedColorImages(colorImages);
    setSelectedColor(colorName);
    setMainImage(`http://localhost:5000/${colorImages[0]}`);
  };

  const percentageDifference = Math.round(((listingPrice - sellingPrice) / listingPrice) * 100);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      text: reviewText,
      rating,
      image: reviewImage,
    };
    setReviews([...reviews, newReview]);
    setReviewText('');
    setRating(0);
    setReviewImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="image-gallery">
          <div className="thumbnail-container">
            {selectedColorImages.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${img}`}
                alt={`${title} ${index + 1}`}
                className="thumbnail"
                onMouseOver={() => setMainImage(`http://localhost:5000/${img}`)}
              />
            ))}
          </div>

          <div className="main-image-container">
            <div className="sales-tag">
              <img src={offerTag} alt="Sales Tag" className="sales-tag-image" />
              <span className="sales-tag-text">{percentageDifference}%</span>
            </div>
            <img src={mainImage} alt={title} className="main-image" />
          </div>
        </div>

        <div className="product-info">
          <h1>{title}</h1>
          <p className="product-description">{description}</p>
          <p className="product-price"><strong>Listing Price: </strong><s>${listingPrice}</s></p>
          <p className="product-selling-price"><strong>Selling Price: </strong>${sellingPrice}</p>
          <p className="percentage-difference">Save {percentageDifference}%</p>
          <p className="product-color"><strong>Color: </strong>{selectedColor}</p>
          <p className="product-id"><strong>Product ID: </strong>{productId}</p>
          <div className="product-details">
            <h3>Details</h3>
            <p>{details}</p>
          </div>
          <div className="about-item">
            <h3>About This Item</h3>
            <p>{about}</p>
          </div>
          <div className="purchase-buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
            <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
          </div>
          <div className="other-colors">
            <h2>Other Colors Available</h2>
            <div className="colors-container">
              {allColors.map((colorItem, index) => (
                <div key={index} className="color-item" onClick={() => handleColorChange(colorItem.images, colorItem.color)}>
                  <p>{colorItem.color}</p>
                  <img
                    src={`http://localhost:5000/${colorItem.images[0]}`}
                    alt={`${title} ${colorItem.color}`}
                    className="color-thumbnail"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review">
              <div className="review-rating">
                {[...Array(5)].map((star, i) => (
                  <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
                ))}
              </div>
              <p>{review.text}</p>
              {review.image && <img src={review.image} alt="Review" className="review-image" />}
            </div>
          ))
        )}
        <form onSubmit={handleReviewSubmit} className="review-form">
          <label>
            Rating:
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[...Array(5)].map((star, i) => (
                <option key={i} value={i + 1}>{i + 1} Star{i + 1 > 1 && 's'}</option>
              ))}
            </select>
          </label>
          <label>
            Comment:
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required />
          </label>
          <label>
            Upload Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;
