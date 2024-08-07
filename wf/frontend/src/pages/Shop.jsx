// shop.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './shop.css';
import offerTag from '../components/assets/offer.png'; // Import the sales tag image

const ShopList = () => {
  const [products, setProducts] = useState([]);
  const [visibleDropdown, setVisibleDropdown] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null); // State for selected price range
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const [lock, setLock] = useState(false); // Add state for lock
  const productsPerPage = 16; // Number of products per page
  const dropdownRef = useRef(null);
  const { addToCart } = useCart();

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

  const toggleDropdown = (dropdown) => {
    setVisibleDropdown((prevDropdown) => (prevDropdown === dropdown ? null : dropdown));
  };

  const filterByPriceRange = (maxPrice) => {
    setSelectedPriceRange(maxPrice);
    setVisibleDropdown(null); // Close the dropdown after selecting price range
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddToCart = (product) => {
    if (!lock) {
      setLock(true);
      addToCart(product);
      setTimeout(() => {
        setLock(false);
      }, 500); // Adjust the duration as needed
    }
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
                  <div className="price-container">
                    <p className="listing-price"><s>₹{product.listingPrice}</s></p>
                    <p className="product-selling-price">₹{product.sellingPrice}</p>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() =>
                      handleAddToCart({
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
                    disabled={lock} // Disable button when lock is true
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
      <nav className="filter-navbar" ref={dropdownRef}>
        <span className="filter-label">Filter By</span>
        <div className="dropdown">
          <div className="dpprice">
            <button className="dropbtnn" onClick={() => toggleDropdown('price')}>
              Price <i className="fas fa-caret-down"></i>
            </button>
          </div>
          {visibleDropdown === 'price' && (
            <div className="dropdown-content fade-in">
              <button onClick={() => filterByPriceRange(299)}>Less than 299</button>
              <button onClick={() => filterByPriceRange(399)}>Less than 399</button>
              <button onClick={() => filterByPriceRange(499)}>Less than 499</button>
              <button onClick={() => filterByPriceRange(599)}>Less than 599</button>
              <button onClick={() => filterByPriceRange(699)}>Less than 699</button>
              <button onClick={() => filterByPriceRange(799)}>Less than 799</button>
            </div>
          )}
        </div>
      </nav>
      {renderProducts()}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>&lt;</button>
        <div className="page-indicator">{currentPage}</div>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={(currentPage + 1) * productsPerPage >= products.length}>&gt;</button>
      </div>
    </div>
  );
};

export default ShopList;
