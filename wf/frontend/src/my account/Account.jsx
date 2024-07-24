import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import './account.css'; // Optional: Add CSS for styling
import UserProfile from './UserProfile';
import ChangeUserDetails from './ChangeUserDetails';
import MyOrders from '../my account/MyOrders'; // Import MyOrders component
import ForgetPassword from '../my account/ForgetPassword'; // Import ForgetPassword component
import Loaduser from '../my account/loaduser'; // Import MyOrders component

const Account = () => {
  const menuItems = [
    { name: 'Userprofile', path: '/account/userprofile' },
    { name: 'MyOrder', path: '/account/myorder' },
    { name: 'Loaduser', path: '/account/loaduser' },
    { name: 'ForgetPassword', path: '/account/forget-password' }, // Corrected path for ForgetPassword
    { name: 'Changeuser', path: '/account/changeuser' },
  ];

  return (
    <div className="account-container">
      <div className="account-dropdown">
        <ul className="dropdown-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="dropdown-menu-item">
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="account-details">
        <Routes>
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/changeuser" element={<ChangeUserDetails />} />
          <Route path="/myorder" element={<MyOrders />} /> {/* Add MyOrders route */}
          <Route path="/account/ForgetPassword" element={<ForgetPassword />} /> {/* Route for ForgetPassword */}
          <Route path="/loaduser" element={<Loaduser />} /> {/* Add MyOrders route */}
          <Route path="/account/forget-password" element={<ForgetPassword />} /> {/* Route for ForgetPassword */}

          {/* Add other routes here as needed */}
        </Routes>
      </div>
    </div>
  );
};

export default Account;
