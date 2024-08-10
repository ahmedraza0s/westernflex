import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import offerTag from '../components/assets/offer.png'; // Import the sales tag image

const Product = ({ product, color, onAddToCart, onVisible }) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onVisible();
          entry.target.classList.add('animate-on-scroll');
        } else {
          entry.target.classList.remove('animate-on-scroll');
        }
      });
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [onVisible]);

  const percentageDifference = Math.round(((product.listingPrice - product.sellingPrice) / product.listingPrice) * 100);

  return (
    <div className="product" ref={ref}>
      <div className="sales-tag">
        <img src={offerTag} alt="Sales Tag" className="sales-tag-image" />
        <span className="sales-tag-text">{percentageDifference}%</span>
      </div>
      <Link
        to={`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`}
        state={{
          image: color.images[0],
          title: product.name,
          description: product.shortDescription,
          listingPrice: product.listingPrice,
          sellingPrice: product.sellingPrice,
          details: product.longDescription,
          about: product.about,
          images: color.images,
          color: color.color,
          allColors: product.colors,
          productId: product.productId,
        }}
      >
        <img
          src={`http://localhost:5000/${color.images[0]}`}
          alt={product.name}
          className="product-image"
        />
      </Link>
      <h3 className="product-title">{product.name}</h3>
      <div className="price-container">
        <p className="listing-price"><s>₹{product.listingPrice}</s></p>
        <p className="product-selling-price">₹{product.sellingPrice}</p>
      </div>
      <button
        className="add-to-cart-btn"
        onClick={() => onAddToCart({
          image: `http://localhost:5000/${color.images[0]}`,
          title: product.name,
          description: product.shortDescription,
          listingPrice: product.listingPrice,
          sellingPrice: product.sellingPrice,
          details: product.longDescription,
          about: product.about,
          images: color.images,
          color: color.color,
          productId: product.productId,
        })}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
