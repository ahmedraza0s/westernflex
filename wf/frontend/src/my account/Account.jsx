import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import './account.css'; // Optional: Add CSS for styling
import UserProfile from './UserProfile';
import ChangeUserDetails from './ChangeUserDetails';
import MyOrders from '../my account/MyOrders'; // Import MyOrders component
import ForgetPassword from '../my account/ForgetPassword'; // Import ForgetPassword component
import UserReview from './UserReview';
import ReturnOrder from './ReturnOrder';

const Account = () => {
  const menuItems = [
    { name: 'Userprofile', path: '/account/userprofile' },
    { name: 'MyOrder', path: '/account/myorder' },
    { name: 'userreview', path: '/account/userreview' },
    { name: 'ForgetPassword', path: '/account/forget-password' }, // Corrected path for ForgetPassword
    { name: 'Changeuser', path: '/account/changeuser' },
    { name: 'Return Order', path: '/account/return-order' },
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
          <Route path="/forget-password" element={<ForgetPassword />} /> {/* Route for ForgetPassword */}
          <Route path="/userreview" element={<UserReview />} /> {/* Add MyOrders route */}
          <Route path="/return-order" element={<ReturnOrder />} />

          {/* Add other routes here as needed */}
        </Routes>
      </div>
    </div>
  );
};

export default Account;
