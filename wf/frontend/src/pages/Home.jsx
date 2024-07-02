import React, { useState, useEffect } from 'react';
import './home.css'; // Assuming pg1.css contains your custom styles
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './shop.css';

const Product = ({ image, title, description, price, details, about, images }) => {
  const { addToCart } = useCart();

  return (
    <div className="product">
      <Link to={`/product/${title.replace(/\s+/g, '-').toLowerCase()}`} state={{ image, title, description, price, details, about, images }}>
        <img src={image} alt={title} className="product-image" />
      </Link>
      <h3 className="product-title">{title}</h3>
      <p className="product-description">{description}</p>
      <button className="add-to-cart-btn" onClick={() => addToCart({ image, title, description, price, details, about, images })}>Add to Cart</button>
    </div>
  );
};

const Shop = () => {
  const [currentSlide, setCurrentSlide] = useState(0); // State to track current slide index
  const [slideInterval, setSlideInterval] = useState(null); // State to hold interval ID

  // Array of slide image URLs
  const slides = [
    'https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
  ];

  // Function to handle next slide
  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % slides.length);
  };

  // Function to navigate to specific slide
  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Effect to start and stop interval
  useEffect(() => {
    const interval = setInterval(nextSlide, 1000); // Change slide every 1 second (1000ms)
    setSlideInterval(interval); // Save interval ID to state

    return () => {
      clearInterval(interval); // Cleanup: Clear interval on component unmount
    };
  }, []); // Empty dependency array ensures effect runs only on mount and unmount
  
  return (
    <div>
      <section>
        <div className="section1">
          <div className="img-slider">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide}
                alt={`Slide ${index}`}
                className={index === currentSlide ? 'img active' : 'img'}
                style={{ transform: `translateX(-${currentSlide * 180}px)` }}
              />
            ))}
          </div>
        </div>
        <div className="navigation-dots">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={index === currentSlide ? 'dot active' : 'dot'}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      </section>
      
      <div>
        <h1>BEST SELLER PRODUCTS</h1>
        <div className="product-container">
          <Product
            image="https://m.media-amazon.com/images/I/71WNjY5bRRL._AC_SX679_.jpg"
            title="Hand bag"
            description="BeeGreen Personalized Tote Bags for Women Initial Monogrammed Carnation Embroidered Canvas Jute Birthday Gift Bags"
            price="599"
            details="Size: 12'x14', Color: Red, Material: Canvas"
            about="【VERSATILE & DURABLE WOMEN'S TOTE BAG】: This personalized tote bag is designed with convenience in mind, featuring 1 side pockets for essentials like a water bottle, inner zipper pockets for your phone, and a zipper closure to secure your items. Suitable for various occasions including the beach, weddings, work, or travel, this canvas tote is a thoughtful and practical gift option for women of all ages."
            images={[
              "https://m.media-amazon.com/images/I/81aXfD4KdVL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/71RnFQDRxwL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/71Gzx5sJJQL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/610qYpAOiNL._AC_SX569_.jpg"
            ]}
          />
          <Product
            image="https://m.media-amazon.com/images/I/71WNjY5bRRL._AC_SX679_.jpg"
            title="Hand bag"
            description="BeeGreen Personalized Tote Bags for Women Initial Monogrammed Carnation Embroidered Canvas Jute Birthday Gift Bags"
            price="599"
            details="Size: 12'x14', Color: Red, Material: Canvas"
            about="【VERSATILE & DURABLE WOMEN'S TOTE BAG】: This personalized tote bag is designed with convenience in mind, featuring 1 side pockets for essentials like a water bottle, inner zipper pockets for your phone, and a zipper closure to secure your items. Suitable for various occasions including the beach, weddings, work, or travel, this canvas tote is a thoughtful and practical gift option for women of all ages."
            images={[
              "https://m.media-amazon.com/images/I/81aXfD4KdVL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/71RnFQDRxwL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/71Gzx5sJJQL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/610qYpAOiNL._AC_SX569_.jpg"
            ]}
          />
          <Product
            image="https://m.media-amazon.com/images/I/71WNjY5bRRL._AC_SX679_.jpg"
            title="Hand bag"
            description="BeeGreen Personalized Tote Bags for Women Initial Monogrammed Carnation Embroidered Canvas Jute Birthday Gift Bags"
            price="599"
            details="Size: 12'x14', Color: Red, Material: Canvas"
            about="【VERSATILE & DURABLE WOMEN'S TOTE BAG】: This personalized tote bag is designed with convenience in mind, featuring 1 side pockets for essentials like a water bottle, inner zipper pockets for your phone, and a zipper closure to secure your items. Suitable for various occasions including the beach, weddings, work, or travel, this canvas tote is a thoughtful and practical gift option for women of all ages."
            images={[
              "https://m.media-amazon.com/images/I/81aXfD4KdVL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/71RnFQDRxwL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/71Gzx5sJJQL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/610qYpAOiNL._AC_SX569_.jpg"
            ]}
          />
          <Product
            image="https://m.media-amazon.com/images/I/71WNjY5bRRL._AC_SX679_.jpg"
            title="Hand bag"
            description="BeeGreen Personalized Tote Bags for Women Initial Monogrammed Carnation Embroidered Canvas Jute Birthday Gift Bags"
            price="599"
            details="Size: 12'x14', Color: Red, Material: Canvas"
            about="【VERSATILE & DURABLE WOMEN'S TOTE BAG】: This personalized tote bag is designed with convenience in mind, featuring 1 side pockets for essentials like a water bottle, inner zipper pockets for your phone, and a zipper closure to secure your items. Suitable for various occasions including the beach, weddings, work, or travel, this canvas tote is a thoughtful and practical gift option for women of all ages."
            images={[
              "https://m.media-amazon.com/images/I/81aXfD4KdVL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/71RnFQDRxwL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/71Gzx5sJJQL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/610qYpAOiNL._AC_SX569_.jpg"
            ]}
          />
          <Product
            image="https://m.media-amazon.com/images/I/71WNjY5bRRL._AC_SX679_.jpg"
            title="Hand bag"
            description="BeeGreen Personalized Tote Bags for Women Initial Monogrammed Carnation Embroidered Canvas Jute Birthday Gift Bags"
            price="599"
            details="Size: 12'x14', Color: Red, Material: Canvas"
            about="【VERSATILE & DURABLE WOMEN'S TOTE BAG】: This personalized tote bag is designed with convenience in mind, featuring 1 side pockets for essentials like a water bottle, inner zipper pockets for your phone, and a zipper closure to secure your items. Suitable for various occasions including the beach, weddings, work, or travel, this canvas tote is a thoughtful and practical gift option for women of all ages."
            images={[
              "https://m.media-amazon.com/images/I/81aXfD4KdVL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/71RnFQDRxwL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/71Gzx5sJJQL._AC_SX569_.jpg",
              "https://m.media-amazon.com/images/I/610qYpAOiNL._AC_SX569_.jpg"
            ]}
          />
          {/* Repeat for other products */}
        </div>
         </div>
    </div>
  );
};

export default Shop;
