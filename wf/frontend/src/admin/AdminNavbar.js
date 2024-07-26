import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminNavbar = () => {
  const { isAdmin, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/products">Products</Link></li>
        <li><Link to="/admin/update-order">Update Orders</Link></li>
        <li><Link to="/admin/manage-users">manage Users</Link></li>
        <li><Link to="/admin/upload-product">Upload Product</Link></li>
        <li><Link to="/admin/update-product">Update and add colors to Product</Link></li>
        <li><Link to="/admin/add-image">Add Image</Link></li>
        <li><Link to="/admin/product-list">Product List</Link></li>
        <li><Link to="/admin/Update-Metadata">Update Meta Data</Link></li>
        <li><Link to="/admin/user-order">All orders</Link></li>
        <li><Link to="/admin/admin-register">Register</Link></li>
        
      
        {isAdmin && <button onClick={logout}>Logout</button>}
      </ul>
    </nav>
  );
};

export default AdminNavbar;
