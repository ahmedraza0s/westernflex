// src/Shop.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './shop.css';

const Product = ({ image, title, description, price, details, about, images }) => {
    const navigate = useNavigate();

    const handleProductClick = () => {
        navigate(`/product/${title.replace(/\s+/g, '-').toLowerCase()}`, { state: { image, title, description, price, details, about, images } });
    };

    return (
        <div className="product" onClick={handleProductClick}>
            <Link to={`/product/${title.replace(/\s+/g, '-').toLowerCase()}`} state={{ image, title, description, price, details, about, images }}>
                <img src={image} alt={title} className="product-image" />
            </Link>
            <h3 className="product-title">{title}</h3>
            <p className="product-description">{description}</p>
            <button className="add-to-cart-btn">Add to Cart</button>
        </div>
    );
};

const Shop = () => {
    const [visibleDropdown, setVisibleDropdown] = useState(null);
    const dropdownRef = useRef();

    const toggleDropdown = (dropdown) => {
        setVisibleDropdown(visibleDropdown === dropdown ? null : dropdown);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setVisibleDropdown(null);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <nav className="filter-navbar" ref={dropdownRef}>
                <span className="filter-label">Filter By</span>
                <div className="dropdown">
                    <a
                        href="#"
                        className="dropbtn slide-in"
                        onClick={() => toggleDropdown('price')}
                    >
                        Price <i className="fas fa-caret-down"></i>
                    </a>
                    {visibleDropdown === 'price' && (
                        <div className="dropdown-content fade-in">
                            <a href="#">Less than 299</a>
                            <a href="#">Less than 399</a>
                            <a href="#">Less than 499</a>
                            <a href="#">Less than 599</a>
                            <a href="#">Less than 699</a>
                            <a href="#">Less than 799</a>
                        </div>
                    )}
                </div>
                <div className="dropdown">
                    <a
                        href="#"
                        className="dropbtn slide-in"
                        onClick={() => toggleDropdown('categories')}
                    >
                        Categories <i className="fas fa-caret-down"></i>
                    </a>
                    {visibleDropdown === 'categories' && (
                        <div className="dropdown-content fade-in">
                            <a href="#">College Bags</a>
                            <a href="#">School Bags</a>
                            <a href="#">Office Bags</a>
                            <a href="#">Premium Bags</a>
                            <a href="#">Travel Bags</a>
                            <a href="#">Hand Bags</a>
                        </div>
                    )}
                </div>
            </nav>
            <div className="product-container">
                <Product 
                    image="https://m.media-amazon.com/images/I/71WNjY5bRRL._AC_SX679_.jpg"
                    title="Hand bag"
                    description="BeeGreen Personalized Tote Bags for Women Initial Monogrammed Carnation Embroidered Canvas Jute Birthday Gift Bags"
                    price="599"
                    details="Size: 12'x14', Color: Red, Material: Canvas"
                    about="【VERSATILE & DURABLE WOMEN'S TOTE BAG】: This personalized tote bag is designed with convenience in mind, featuring 1 side pockets for essentials like a water bottle, inner zipper pockets for your phone, and a zipper closure to secure your items.
                    Suitable for various occasions including the beach, weddings, work, or travel, this canvas tote is a thoughtful and practical gift option for women of all ages."
                    images={[
                        "https://m.media-amazon.com/images/I/81aXfD4KdVL._AC_SX569_.jpg",
                        "https://m.media-amazon.com/images/I/71RnFQDRxwL._AC_SX569_.jpg",
                        "https://m.media-amazon.com/images/I/71Gzx5sJJQL._AC_SX569_.jpg",
                        "https://m.media-amazon.com/images/I/610qYpAOiNL._AC_SX569_.jpg"
                    ]}
                />
                {/* Other Product Components */}
                <Product 
                    image="https://via.placeholder.com/150"
                    title="Product 2"
                    description="This product is amazing."
                    price="$19.99"
                    details="Size: Medium, Color: Blue, Material: Plastic"
                    about="An amazing product for daily use."
                    images={[
                        "https://via.placeholder.com/150",
                        "https://via.placeholder.com/150/0000FF",
                        "https://via.placeholder.com/150/FFFF00",
                        "https://via.placeholder.com/150/FF0000"
                    ]}
                />
                <Product 
                    image="https://via.placeholder.com/150"
                    title="Product 3"
                    description="This product is amazing."
                    price="$19.99"
                    details="Size: Medium, Color: Blue, Material: Plastic"
                    about="An amazing product for daily use."
                    images={[
                        "https://via.placeholder.com/150",
                        "https://via.placeholder.com/150/0000FF",
                        "https://via.placeholder.com/150/FFFF00",
                        "https://via.placeholder.com/150/FF0000"
                    ]}
                />
                <Product 
                    image="https://via.placeholder.com/150"
                    title="Product 4"
                    description="This product is amazing."
                    price="$29.99"
                    details="Size: Large, Color: Green, Material: Metal"
                    about="High-quality product with excellent durability."
                    images={[
                        "https://via.placeholder.com/150",
                        "https://via.placeholder.com/150/00FF00",
                        "https://via.placeholder.com/150/00FFFF",
                        "https://via.placeholder.com/150/FF00FF"
                    ]}
                />
                <Product 
                    image="https://via.placeholder.com/150"
                    title="Product 5"
                    description="This product is amazing."
                    price="$19.99"
                    details="Size: Medium, Color: Blue, Material: Plastic"
                    about="An amazing product for daily use."
                    images={[
                        "https://via.placeholder.com/150",
                        "https://via.placeholder.com/150/0000FF",
                        "https://via.placeholder.com/150/FFFF00",
                        "https://via.placeholder.com/150/FF0000"
                    ]}
                />
                <Product 
                    image="https://via.placeholder.com/150"
                    title="Product 6"
                    description="This product is amazing."
                    price="$19.99"
                    details="Size: Medium, Color: Blue, Material: Plastic"
                    about="An amazing product for daily use."
                    images={[
                        "https://via.placeholder.com/150",
                        "https://via.placeholder.com/150/0000FF",
                        "https://via.placeholder.com/150/FFFF00",
                        "https://via.placeholder.com/150/FF0000"
                    ]}
                />
                <Product 
                    image="https://via.placeholder.com/150"
                    title="Product 7"
                    description="This product is amazing."
                    price="$29.99"
                    details="Size: Large, Color: Green, Material: Metal"
                    about="High-quality product with excellent durability."
                    images={[
                        "https://via.placeholder.com/150",
                        "https://via.placeholder.com/150/00FF00",
                        "https://via.placeholder.com/150/00FFFF",
                        "https://via.placeholder.com/150/FF00FF"
                    ]}
                />
            </div>
        </div>
    );
};

export default Shop;
