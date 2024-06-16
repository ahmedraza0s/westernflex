import React from 'react';
import './navbar.css';

const Navbar = () => {
    // Event handling functions can be defined here if needed
    const togglePriceRange = (event) => {
        event.preventDefault();
        const priceRange = document.getElementById('price-range');
        priceRange.style.display = priceRange.style.display === 'block' ? 'none' : 'block';
    };

    const toggleSubMenu = (event) => {
        event.preventDefault();
        const submenu = event.target.nextElementSibling;
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    };

    const updatePriceRange = () => {
        const priceSlider = document.getElementById('price-slider');
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');

        minPrice.value = priceSlider.value;
        maxPrice.value = priceSlider.value;
    };

    const updatePriceFromInput = () => {
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');
        const priceSlider = document.getElementById('price-slider');

        let minPriceValue = parseInt(minPrice.value);
        let maxPriceValue = parseInt(maxPrice.value);

        if (minPriceValue > maxPriceValue) {
            const temp = minPriceValue;
            minPriceValue = maxPriceValue;
            maxPriceValue = temp;
        }

        priceSlider.value = minPriceValue;
        minPrice.value = minPriceValue;
        maxPrice.value = maxPriceValue;
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
                            <div id="price-range" className="price-range">
                                <input type="range" min="499" max="999" step="1" value="499" id="price-slider" onInput={updatePriceRange} />
                                <div className="range-values">
                                    <input type="number" id="min-price" value="499" min="499" max="999" step="1" onInput={updatePriceFromInput} />
                                    <input type="number" id="max-price" value="999" min="499" max="999" step="1" onInput={updatePriceFromInput} />
                                </div>
                            </div>
                        </div>
                        <div className="has-sub">
                            <a href="#" onClick={toggleSubMenu}>Discount Percentage <i className="fas fa-caret-right"></i></a>
                            <div className="sub-menu">
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
                    <a href="#"><img src="cart.png" alt="Cart" /></a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
