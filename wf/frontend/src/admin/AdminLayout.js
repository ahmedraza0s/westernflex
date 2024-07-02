import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar'; // Assuming you have a separate navbar for admin

const AdminLayout = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
