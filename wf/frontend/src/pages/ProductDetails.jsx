import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './productDetails.css';
import { useCart } from '../contexts/CartContext';
import offerTag from '../components/assets/offer.png';
import AllReviews from './AllReviews';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [mainImage, setMainImage] = useState('');
  const [selectedColorImages, setSelectedColorImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (!location.state) {
      navigate('/'); // Redirect to home page or any other fallback page
    } else {
      const { image, images, color } = location.state;
      setMainImage(`http://localhost:5000/${image}`);
      setSelectedColorImages(images);
      setSelectedColor(color);
    }
  }, [location.state, navigate]);

  if (!location.state) {
    return null; // Render nothing while redirecting
  }

  const { image, title, description, listingPrice, sellingPrice, details, about, allColors, productId } = location.state;

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

  const shareProduct = () => {
    const shareUrl = `http://localhost:3000/product/${productId}`;
    if (navigator.share) {
      navigator.share({
        title,
        url: shareUrl,
      }).catch(console.error);
    } else {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
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
            <button className="share-btn" onClick={shareProduct}>Share</button>
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
          <AllReviews />

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
