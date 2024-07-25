import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userorder.css';

const UserOrders = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchUsersOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/users-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API Response:', response.data); // Log the response

        if (response.data.users) {
          setUsers(response.data.users);
          console.log('Users data:', response.data.users); // Log user data
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

    fetchUsersOrders();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Apply filtering and sorting to orders
  const filteredAndSortedUsers = users
    .map(user => ({
      ...user,
      orders: user.orders
        .filter(order => filter === 'All' || order.orderStatus === filter)
        .sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate)) // Sort orders by orderDate
    }))
    .filter(user => user.orders.length > 0);

  console.log('Filtered and Sorted Users:', filteredAndSortedUsers); // Debugging: Check filtered and sorted results

  if (loading) {
    return <p>Loading users and orders...</p>;
  }

  return (
    <div className="admin-user-orders-container">
      <h2>All Users' Orders</h2>
      <div className="filter-options">
        <label>Filter by Status: </label>
        <select value={filter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Shipped">Shipped</option>
        </select>
      </div>
      {filteredAndSortedUsers.length === 0 ? (
        <p>No users or orders found.</p>
      ) : (
        <ul>
          {filteredAndSortedUsers.map(user => (
            <li key={user.username}>
              <p><strong>User:</strong> {user.fname} {user.lname} ({user.username})</p>
              <ul>
                {user.orders.map(order => (
                  <li key={order.orderId}>
                    <p><strong>Order ID:</strong> {order.orderId}</p>
                    <p><strong>Status:</strong> {order.orderStatus}</p>
                    <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrders;
