import React, { useState } from 'react';
import './navbar.css';
import cartIcon from '../assets/cart.png'; // Import the cart image

const Navbar = () => {
    const [priceRangeVisible, setPriceRangeVisible] = useState(false);
    const [subMenuVisible, setSubMenuVisible] = useState(false);
    const [price, setPrice] = useState({ min: 499, max: 999 });

    const togglePriceRange = (event) => {
        event.preventDefault();
        setPriceRangeVisible(!priceRangeVisible);
    };

    const toggleSubMenu = (event) => {
        event.preventDefault();
        setSubMenuVisible(!subMenuVisible);
    };

    const updatePriceRange = (event) => {
        const value = event.target.value;
        setPrice({ ...price, min: value, max: value });
    };

    const updatePriceFromInput = (event) => {
        const { id, value } = event.target;
        setPrice({
            ...price,
            [id === 'min-price' ? 'min' : 'max']: parseInt(value),
        });
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <a href="/"><img src="logo.jpg" alt="Logo" /></a>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Search" />
                <i className="fas fa-search"></i>
            </div>
            <ul className="navbar-nav">
                <li><a href="#">Home</a></li>
                <li className="dropdown">
                    <a href="#" className="dropbtn">Shop <i className="fas fa-caret-down"></i></a>
                    <div className="dropdown-content">
                        <div className="has-sub">
                            <a href="#" onClick={togglePriceRange}>Filter by</a>
                            <div id="price-range" className="price-range" style={{ display: priceRangeVisible ? 'block' : 'none' }}>
                                <input type="range" min="499" max="999" step="1" value={price.min} id="price-slider" onInput={updatePriceRange} />
                                <div className="range-values">
                                    <input type="number" id="min-price" value={price.min} min="499" max="999" step="1" onInput={updatePriceFromInput} />
                                    <input type="number" id="max-price" value={price.max} min="499" max="999" step="1" onInput={updatePriceFromInput} />
                                </div>
                            </div>
                        </div>
                        <div className="has-sub">
                            <a href="#" onClick={toggleSubMenu}>Discount Percentage <i className="fas fa-caret-right"></i></a>
                            <div className="sub-menu" style={{ display: subMenuVisible ? 'block' : 'none' }}>
                                <a href="#">10% off or more</a>
                                <a href="#">20% off or more</a>
                                <a href="#">30% off or more</a>
                                <a href="#">50% off or more</a>
                            </div>
                        </div>
                        <a href="#">Pay on Delivery</a>
                        <a href="#">New Arrivals</a>
                        <a href="#">Your Wishlist</a>
                        <a href="#">Best Sellers</a>
                    </div>
                </li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact Us</a></li>
                <li className="dropdown">
                    <a href="#" className="dropbtn">Hello, Sign in <i className="fas fa-caret-down"></i></a>
                    <div className="dropdown-content">
                        <a href="#">Your Account</a>
                        <a href="#">Your Orders</a>
                        <a href="#">Sign Out</a>
                    </div>
                </li>
                <li className="cart-icon">
                    <a href="#"><img src={cartIcon} alt="Cart" /></a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
