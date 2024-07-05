import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './productDetails.css';
import { useCart } from '../contexts/CartContext';

const ProductDetails = () => {
  const location = useLocation();
  const { image, title, description, listingPrice, sellingPrice, details, about, images, color, allColors, productId } = location.state;
  const [mainImage, setMainImage] = useState(`http://localhost:5000/${image}`);
  const { addToCart } = useCart();
  const [selectedColorImages, setSelectedColorImages] = useState(images);
  const [selectedColor, setSelectedColor] = useState(color);

  const handleAddToCart = () => {
    const product = { 
      image: mainImage, 
      title, 
      description, 
      listingPrice, 
      sellingPrice, 
      details, 
      about, 
      color: selectedColor, 
      images: selectedColorImages,
      productId 
    };
    addToCart(product);
  };

  const handleColorChange = (colorImages, newColor) => {
    setSelectedColorImages(colorImages);
    setSelectedColor(newColor);
    setMainImage(`http://localhost:5000/${colorImages[0]}`);
  };

  return (
    <div className="product-details-container">
      <div className="thumbnails">
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
      <div className="product-images">
        <img src={mainImage} alt={title} className="main-image" />
      </div>
      <div className="product-info">
        <h1>{title}</h1>
        <p className="product-description">{description}</p>
        <p className="product-price"><strong>Listing Price: </strong>${listingPrice}</p>
        <p className="product-selling-price"><strong>Selling Price: </strong>${sellingPrice}</p>
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
          <button className="buy-now-btn">Buy Now</button>
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
  );
};


export default ProductDetails;
