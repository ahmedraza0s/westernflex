import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/products">Products</Link></li>
        <li><Link to="/admin/orders">Orders</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/upload-product">Upload Product</Link></li>
        <li><Link to="/admin/add-image">Add Image</Link></li>
        <li><Link to="/admin/product-list">Product List</Link></li>
        <li><Link to="/admin/admin-register">Register</Link></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
