import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Product from './Product'; // Import the Product component
import { useCart } from '../contexts/CartContext';
import './shop.css';

const ShopList = () => {
  const [products, setProducts] = useState([]);
  const [visibleDropdown, setVisibleDropdown] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [lock, setLock] = useState(false);
  const productsPerPage = 16;
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
    setVisibleDropdown(null);
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
      }, 500);
    }
  };

  const handleProductVisible = useCallback(() => {
    // Perform any additional actions when a product becomes visible
  }, []);

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
              return (
                <Product
                  key={`${product._id}-${color.color}`}
                  product={product}
                  color={color}
                  onAddToCart={handleAddToCart}
                  onVisible={handleProductVisible}
                />
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
      <nav className="filter-navbar">
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
