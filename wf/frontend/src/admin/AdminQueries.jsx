import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './adminqueries.css'; // Uncomment and create appropriate CSS styling

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/admin/queries', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setQueries(response.data);
        } else {
          setError(response.data.message || 'No queries found');
        }
      } catch (error) {
        console.error('Error fetching queries:', error);
        setError('An error occurred while fetching queries.');
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  if (loading) {
    return <p>Loading queries...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="admin-queries-container">
      <h2>User Queries</h2>
      {queries.length === 0 ? (
        <p>No queries found.</p>
      ) : (
        <ul>
          {queries.map(query => (
            <li key={query._id} className="query-item">
              <p><strong>Name:</strong> {query.name}</p>
              <p><strong>Email:</strong> {query.email}</p>
              <p><strong>Phone:</strong> {query.phone}</p>
              <p><strong>Message:</strong> {query.message}</p>
              <p><strong>Date:</strong> {new Date(query.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminQueries;
