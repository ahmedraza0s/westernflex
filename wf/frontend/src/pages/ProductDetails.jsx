import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './productDetails.css';
import { useCart } from '../contexts/CartContext';

const ProductDetails = () => {
    const location = useLocation();
    const { image, title, description, price, details, about, images } = location.state;
    const [mainImage, setMainImage] = useState(image);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        const product = { image, title, price };
        addToCart(product);
    };

    return (
        <div className="product-details-container">
            <div className="product-images">
                <img src={mainImage} alt={title} className="main-image" />
                <div className="thumbnail-container">
                    {images.map((img, index) => (
                        <img 
                            key={index}
                            src={img}
                            alt={`${title} ${index + 1}`}
                            className="thumbnail"
                            onMouseOver={() => setMainImage(img)}
                        />
                    ))}
                </div>
            </div>
            <div className="product-info">
                <h1>{title}</h1>
                <p className="product-description">{description}</p>
                <p className="product-price"><strong>Price: </strong>{price}</p>
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
            </div>
        </div>
    );
};

export default ProductDetails;
