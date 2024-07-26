import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './shop.css';
import './home.css';
import offerTag from '../components/assets/offer.png'; // Import the sales tag image

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0); // State to track current slide index
  const [slideInterval, setSlideInterval] = useState(null); // State to hold interval ID
  const [selectedPriceRange, setSelectedPriceRange] = useState(null); // State for selected price range
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const productsPerPage = 16; // Number of products per page
  const dropdownRef = useRef(null);
  const { addToCart } = useCart();

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
    const interval = setInterval(nextSlide, 3000); // Change slide every 3 seconds (3000ms)
    setSlideInterval(interval); // Save interval ID to state

    return () => {
      clearInterval(interval); // Cleanup: Clear interval on component unmount
    };
  }, [currentSlide]);

  // Effect to fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderProducts = () => {
    const filteredProducts = products.filter(product =>
      product.colors.some(color =>
        [1, 2, 3].includes(color.priority) &&
        color.images.length > 0 &&
        (!selectedPriceRange || product.sellingPrice < selectedPriceRange)
      )
    );

    const paginatedProducts = filteredProducts.slice(currentPage * productsPerPage, (currentPage + 1) * productsPerPage);

    return (
      <div className="product-container">
        {paginatedProducts.map((product) =>
          product.colors.map((color) => {
            if ([1, 2, 3].includes(color.priority) && color.images.length > 0) {
              const percentageDifference = Math.round(((product.listingPrice - product.sellingPrice) / product.listingPrice) * 100);

              return (
                <div className="product" key={`${product._id}-${color.color}`}>
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
                  <p className="listing-price"><s>${product.listingPrice}</s></p>
                  <p className="product-selling-price">${product.sellingPrice}</p>
                  <p className="percentage-difference">Save {percentageDifference}%</p>
                  <p className="product-color">Color: {color.color}</p>
                  <button
                    className="add-to-cart-btn"
                    onClick={() =>
                      addToCart({
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
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              );
            } else {
              return null;
            }
          })
        )}
      </div>
    );
  };

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
                style={{ transform: `translateX(-${currentSlide * 100}%)` }} // Adjust to full width of slider
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
        {renderProducts()}
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>&lt;</button>
          <div className="page-indicator">{currentPage + 1}</div>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={(currentPage + 1) * productsPerPage >= products.length}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
