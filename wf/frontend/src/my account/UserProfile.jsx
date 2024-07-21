import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const newAddresses = user.addresses.map((address, i) =>
      i === index ? { ...address, [name]: value } : address
    );
    setUser({ ...user, addresses: newAddresses });
  };

  const addAddress = () => {
    setUser({
      ...user,
      addresses: [...user.addresses, {
        addressId: Date.now().toString(), // Ensure unique addressId
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false
      }]
    });
    setEditingAddressIndex(user.addresses.length); // Set index to the new address
  };

  const handleAddressEdit = (index) => {
    setEditingAddressIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/user/update/${user.username}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully');
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error updating profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {user.fname} {user.lname}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input type="text" name="fname" value={user.fname} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name</label>
          <input type="text" name="lname" value={user.lname} onChange={handleChange} required />
        </div>
        <div>
          <label>Username</label>
          <input type="text" name="username" value={user.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone Number</label>
          <input type="text" name="phno" value={user.phno} onChange={handleChange} required />
        </div>
        {user.addresses.length > 0 ? (
          user.addresses.map((address, index) => (
            <div key={index}>
              <h4>Address {index + 1}</h4>
              {editingAddressIndex === index ? (
                <div>
                  <div>
                    <label>Address Line 1</label>
                    <input type="text" name="addressLine1" value={address.addressLine1} onChange={(e) => handleAddressChange(index, e)} required />
                  </div>
                  <div>
                    <label>Address Line 2</label>
                    <input type="text" name="addressLine2" value={address.addressLine2} onChange={(e) => handleAddressChange(index, e)} />
                  </div>
                  <div>
                    <label>City</label>
                    <input type="text" name="city" value={address.city} onChange={(e) => handleAddressChange(index, e)} required />
                  </div>
                  <div>
                    <label>State</label>
                    <input type="text" name="state" value={address.state} onChange={(e) => handleAddressChange(index, e)} required />
                  </div>
                  <div>
                    <label>Postal Code</label>
                    <input type="text" name="postalCode" value={address.postalCode} onChange={(e) => handleAddressChange(index, e)} required />
                  </div>
                  <div>
                    <label>Country</label>
                    <input type="text" name="country" value={address.country} onChange={(e) => handleAddressChange(index, e)} />
                  </div>
                  <div>
                    <label>Default Address</label>
                    <input type="checkbox" name="isDefault" checked={address.isDefault} onChange={(e) => handleAddressChange(index, e)} />
                  </div>
                  <button type="button" onClick={() => setEditingAddressIndex(null)}>Save</button>
                </div>
              ) : (
                <div>
                  <p>Address Line 1: {address.addressLine1}</p>
                  <p>Address Line 2: {address.addressLine2}</p>
                  <p>City: {address.city}</p>
                  <p>State: {address.state}</p>
                  <p>Postal Code: {address.postalCode}</p>
                  <p>Country: {address.country}</p>
                  <p>Default Address: {address.isDefault ? 'Yes' : 'No'}</p>
                  <button type="button" onClick={() => handleAddressEdit(index)}>Edit</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No addresses found.</div>
        )}
        <button type="button" onClick={addAddress}>Add New Address</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserProfile;
