import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './shop.css';

const ShopList = () => {
  const [products, setProducts] = useState([]);
  const [visibleDropdown, setVisibleDropdown] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null); // State for selected price range
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

  const renderProducts = () => {
    const filteredProducts = products.filter((product) =>
      product.colors.some(
        (color) =>
          [1, 2, 3].includes(color.priority) &&
          color.images.length > 0 &&
          (!selectedPriceRange || product.sellingPrice < selectedPriceRange)
      )
    );

    if (filteredProducts.length === 0) {
      return (
        <div className="no-products">
          <p>No products found under the selected price range.</p>
        </div>
      );
    }

    return (
      <div className="product-container">
        {filteredProducts.map((product) =>
          product.colors.map((color) =>
            [1, 2, 3].includes(color.priority) && color.images.length > 0 &&
            (!selectedPriceRange || product.sellingPrice < selectedPriceRange) ? (
              <div className="product" key={`${product._id}-${color.color}`}>
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
                <p className="product-description">{product.shortDescription}</p>
                <p className="product-price">Listing Price: {product.listingPrice}</p>
                <p className="product-selling-price">Selling Price: {product.sellingPrice}</p>
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
            ) : null
          )
        )}
      </div>
    );
  };

  return (
    <div>
      <nav className="filter-navbar" ref={dropdownRef}>
        <span className="filter-label">Filter By</span>
        <div className="dropdown">
          <button className="dropbtn slide-in" onClick={() => toggleDropdown('price')}>
            Price <i className="fas fa-caret-down"></i>
          </button>
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
        {/* Add other dropdowns as needed */}
      </nav>
      {renderProducts()}
    </div>
  );
};

export default ShopList;
