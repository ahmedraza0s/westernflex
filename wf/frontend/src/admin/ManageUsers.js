import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './manageusers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrders, setShowOrders] = useState({});
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
              <p>
                <strong>Total Orders:</strong> {user.orders.length}
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
                    </li>
                  ))}
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
