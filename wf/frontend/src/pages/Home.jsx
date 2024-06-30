import React, { useState, useEffect } from 'react';
import './admin/home.css'; // Assuming pg1.css contains your custom styles

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
    setCurrentSlide((currentSlide + 2) % slides.length);
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
      clearInterval(slideInterval); // Cleanup: Clear interval on component unmount
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
        <h1>BEST SELLER PRODUCT</h1>
        <div className="product-container">
          <div className="product">
            <a href="/product/hand-bag" state="...">
              <img
                src="https://m.media-amazon.com/images/I/71WNjY5bRRL._AC_SX679_.jpg"
                alt="Hand bag"
                className="product-image"
              />
            </a>
            <h3 className="product-title">Hand bag</h3>
            <p className="product-description">
              BeeGreen Personalized Tote Bags for Women Initial Monogrammed Carnation Embroidered Canvas Jute Birthday Gift Bags
            </p>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
          <div className="product">
            <a href="/product/hand-bag" state="...">
              <img
                src="https://m.media-amazon.com/images/I/71WNjY5bRRL._AC_SX679_.jpg"
                alt="Hand bag"
                className="product-image"
              />
            </a>
            <h3 className="product-title">Hand bag</h3>
            <p className="product-description">
              BeeGreen Personalized Tote Bags for Women Initial Monogrammed Carnation Embroidered Canvas Jute Birthday Gift Bags
            </p>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
          <div className="product">
            <a href="/product/hand-bag" state="...">
              <img
                src="https://m.media-amazon.com/images/I/71WNjY5bRRL._AC_SX679_.jpg"
                alt="Hand bag"
                className="product-image"
              />
            </a>
            <h3 className="product-title">Hand bag</h3>
            <p className="product-description">
              BeeGreen Personalized Tote Bags for Women Initial Monogrammed Carnation Embroidered Canvas Jute Birthday Gift Bags
            </p>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
          <div className="product">
            <a href="/product/hand-bag" state="...">
              <img
                src="https://m.media-amazon.com/images/I/71WNjY5bRRL._AC_SX679_.jpg"
                alt="Hand bag"
                className="product-image"
              />
            </a>
            <h3 className="product-title">Hand bag</h3>
            <p className="product-description">
              BeeGreen Personalized Tote Bags for Women Initial Monogrammed Carnation Embroidered Canvas Jute Birthday Gift Bags
            </p>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
          {/* Repeat for other products */}
        </div>
      </div>
    </div>
  );
};

export default Shop;
