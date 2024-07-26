import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './manageusers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrders, setShowOrders] = useState({});
  const [showAddresses, setShowAddresses] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API Response:', response.data);

      if (response.data.users) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        console.log('Users data:', response.data.users);
      } else {
        alert('No users or orders found.');
      }
    } catch (error) {
      console.error('Error fetching users and orders:', error);
      alert('An error occurred while fetching users and orders.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrdersVisibility = (username) => {
    setShowOrders((prevShowOrders) => ({
      ...prevShowOrders,
      [username]: !prevShowOrders[username],
    }));
  };

  const toggleAddressesVisibility = (username) => {
    setShowAddresses((prevShowAddresses) => ({
      ...prevShowAddresses,
      [username]: !prevShowAddresses[username],
    }));
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user =>
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.fname && user.fname.toLowerCase().includes(query)) ||
      (user.lname && user.lname.toLowerCase().includes(query))
    );
    setFilteredUsers(filtered);
  };

  if (loading) {
    return <p>Loading users and orders...</p>;
  }

  return (
    <div className="admin-manage-users-container">
      <h2>Manage Users</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.username}>
              <p><strong>Name:</strong> {user.fname} {user.lname}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Phone Number:</strong> {user.phno}</p>
              <p><strong>Total Orders:</strong> {user.orders.length}
                <button onClick={() => toggleOrdersVisibility(user.username)}>
                  {showOrders[user.username] ? 'Hide Orders' : 'Show Orders'}
                </button>
              </p>
              {showOrders[user.username] && (
                <ul>
                  {user.orders.map((order) => (
                    <li key={order.orderId}>
                      <p><strong>Order ID:</strong> {order.orderId}</p>
                      <p><strong>Status:</strong> {order.orderStatus}</p>
                      <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              )}
              <p>
                <button onClick={() => toggleAddressesVisibility(user.username)}>
                  {showAddresses[user.username] ? 'Hide Addresses' : 'Show Addresses'}
                </button>
              </p>
              {showAddresses[user.username] && (
                <ul>
                  {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((address, index) => (
                      <li key={index}>
                        <p><strong>Address Line 1:</strong> {address.addressLine1}</p>
                        {address.addressLine2 && <p><strong>Address Line 2:</strong> {address.addressLine2}</p>}
                        <p><strong>City:</strong> {address.city}</p>
                        <p><strong>State:</strong> {address.state}</p>
                        <p><strong>Postal Code:</strong> {address.postalCode}</p>
                        {address.country && <p><strong>Country:</strong> {address.country}</p>}
                        {address.isDefault && <p><strong>Default Address</strong></p>}
                      </li>
                    ))
                  ) : (
                    <p>No addresses available.</p>
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageUsers;
