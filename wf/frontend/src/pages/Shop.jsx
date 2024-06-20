import React from 'react';
import './shop.css';

const Shop = () => {
    return (
        <div>
           <nav class="filter-navbar">
    <div class="dropdown">
        <a href="#" class="dropbtn slide-in">Price <i class="fas fa-caret-down"></i></a>
        <div class="dropdown-content fade-in">
            <a href="#">Less than 299</a>
            <a href="#">Less than 399</a>
            <a href="#">Less than 499</a>
            <a href="#">Less than 599</a>
            <a href="#">Less than 699</a>
            <a href="#">Less than 799</a>
        </div>
    </div>
    <div class="dropdown">
        <a href="#" class="dropbtn slide-in">Categories <i class="fas fa-caret-down"></i></a>
        <div class="dropdown-content fade-in">
            <a href="#">College Bags</a>
            <a href="#">School Bags</a>
            <a href="#">Office Bags</a>
            <a href="#">Premium Bags</a>
            <a href="#">Travel Bags</a>
            <a href="#">Hand Bags</a>
        </div>
    </div>
</nav>
            <h1>Shop Page</h1>
            <p>Welcome to the Shop page!</p>
           
        </div>
    );
};

export default Shop;
