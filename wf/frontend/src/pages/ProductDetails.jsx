import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './productDetails.css';
import { useCart } from '../contexts/CartContext';

const ProductDetails = () => {
  const location = useLocation();
  const { image, title, description, listingPrice, sellingPrice, details, about, images, color, productId } = location.state;
  const [mainImage, setMainImage] = useState(`http://localhost:5000/${image}`);
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    handleSearch(); // Fetch products for the given productId
  }, [productId]); // Update when productId changes

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    const product = { 
      image: mainImage, 
      title, 
      description, 
      listingPrice, 
      sellingPrice, 
      details, 
      about, 
      color, 
      productId 
    };
    addToCart(product);
  };

  return (
    <div className="product-details-container">
      <div className="thumbnails">
        {images.map((img, index) => (
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
        <p className="product-color"><strong>Color: </strong>{color}</p>
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
            {products.length > 0 && products.map((product) => (
              product.colors.map((c, index) => (
                <div key={index} className="color-item">
                  <p>{c.color}</p>
                  <img
                    src={`http://localhost:5000/${c.images[0]}`}
                    alt={`${title} ${c.color}`}
                    className="color-thumbnail"
                    onMouseOver={() => setMainImage(`http://localhost:5000/${c.images[0]}`)}
                  />
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
