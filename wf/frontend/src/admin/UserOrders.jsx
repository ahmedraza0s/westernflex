import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userorder.css';

const UserOrders = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [dayFilter, setDayFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchUsersOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/users-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.users) {
          setUsers(response.data.users);
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
    const { name, value } = e.target;
    if (name === 'status') setFilter(value);
    if (name === 'year') setYearFilter(value);
    if (name === 'month') setMonthFilter(value);
    if (name === 'day') setDayFilter(value);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  // Apply filtering and sorting to orders
  const filteredAndSortedUsers = users
    .map(user => ({
      ...user,
      orders: user.orders
        .filter(order => {
          const orderDate = new Date(order.orderDate);
          const orderYear = orderDate.getFullYear().toString();
          const orderMonth = (orderDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() is zero-based
          const orderDay = orderDate.getDate().toString().padStart(2, '0');

          return (
            (filter === 'All' || order.orderStatus === filter) &&
            (!yearFilter || orderYear === yearFilter) &&
            (!monthFilter || orderMonth === monthFilter) &&
            (!dayFilter || orderDay === dayFilter)
          );
        })
        .sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate)) // Sort orders by orderDate
    }))
    .filter(user => user.orders.length > 0);

  if (loading) {
    return <p>Loading users and orders...</p>;
  }

  return (
    <div className="admin-user-orders-container">
      <h2>All Users' Orders</h2>
      <div className="filter-options">
        <label>Filter by Status: </label>                                      
        <select name="status" value={filter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="shipped">Shipped</option>
        </select>
        <br /><br />
        <label>Filter by Year: </label>
        <input
          type="number"
          name="year"
          value={yearFilter}
          onChange={handleFilterChange}
          placeholder="YYYY"
        />

        <label>Filter by Month: </label>
        <input
          type="number"
          name="month"
          value={monthFilter}
          onChange={handleFilterChange}
          placeholder="MM"
          min="1"
          max="12"
        />

        <label>Filter by Day: </label>
        <input
          type="number"
          name="day"
          value={dayFilter}
          onChange={handleFilterChange}
          placeholder="DD"
          min="1"
          max="31"
        />
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
                  <li key={order.orderId} onClick={() => handleOrderClick(order)}>
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
