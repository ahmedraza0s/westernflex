import React, { useState } from 'react';
import axios from 'axios';
import './changeUserDetails.css';

const ChangeAddress = () => {
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    state: '',
    district: '',
    city: '',
    pincode: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'pincode' && value.length === 6) {
      if (/^\d{6}$/.test(value)) {
        fetchLocationDetails(value);
      } else {
        setError('Invalid Pincode Format');
      }
    } else if (name === 'pincode' && value.length !== 6) {
      setError('');
    }
  };

  const fetchLocationDetails = async (pincode) => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const { PostOffice } = response.data[0];
      console.log('API Response:', response.data); // Check API response in console
      if (PostOffice && PostOffice.length > 0) {
        setFormData({
          ...formData,
          city: PostOffice[0].Name,
          district: PostOffice[0].District,
          state: PostOffice[0].State,
          pincode: pincode
        });
        setError('');
      } else {
        setError('Invalid Pincode');
        setFormData({
          ...formData,
          city: '',
          district: '',
          state: ''
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      setError('Error fetching location details');
      setFormData({
        ...formData,
        city: '',
        district: '',
        state: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error) {
      console.log('Address Changed:', formData);
      // Add your logic to handle form submission or API calls here
    }
  };

  return (
    <section id="changeAdd">

<form className="delivery-address-change">
      <h2>Change Personal Details</h2>
        
        <label className='one'>
          Enter your name:
          <input 
            type="text" 
            name="addressLine1" 
            className='inputChangeAdd' 
            placeholder="Enter your name" 
           // value={formData.addressLine1}
            onChange={handleChange}
            required 
          />
        </label>
        <br />

        <label className='one'>
          Enter your username:
          <input 
            type="text" 
            name="addressLine1" 
            className='inputChangeAdd' 
            placeholder="Enter your username" 
           // value={formData.addressLine1}
            onChange={handleChange}
            required 
          />
        </label>
        <br />
        <label className='one'>
          Enter your Email Id:
          <input 
            type="text" 
            name="addressLine1" 
            className='inputChangeAdd' 
            placeholder="Enter your Email Id" 
           // value={formData.addressLine1}
            onChange={handleChange}
            required 
          />
        </label>
        <br />
        <label className='one'>
          Enter your mobile no.:
          <input 
            type="text" 
            name="addressLine1" 
            className='inputChangeAdd' 
            placeholder="Enter your mobile no." 
           // value={formData.addressLine1}
            onChange={handleChange}
            required 
          />
        </label>
        <br />
      
        <button type="submit" className="btn2">Change Details</button>
      
      </form>
      <br/>
    

      <form onSubmit={handleSubmit} className="delivery-address-change">
        <h2>Change Delivery address</h2>
        
        <label className='one'>
          Enter your address Line 1:
          <input 
            type="text" 
            name="addressLine1" 
            className='inputChangeAdd' 
            placeholder="Enter your address Line 1" 
            value={formData.addressLine1}
            onChange={handleChange}
            required 
          />
        </label>
        <br />
        
        <label className='one'>
          Enter your address Line 2:
          <input 
            type="text" 
            name="addressLine2" 
            className='inputChangeAdd' 
            placeholder="Enter your address Line 2" 
            value={formData.addressLine2}
            onChange={handleChange}
            required 
          />
        </label>
        <br/>
        
        <label className='one'>
          Enter the pincode:
          <input 
            type="text" 
            name="pincode" 
            placeholder="Enter the pincode"
            className='inputChangeAdd' 
            value={formData.pincode}
            onChange={handleChange}
            required 
          />
        </label>
        <br />
        
        <label className='one'>
          Enter your State:
          <input 
            type="text" 
            name="state" 
            className='inputChangeAdd' 
            placeholder="Enter your state" 
            value={formData.state}
            onChange={handleChange}
            required 
          />
        </label>
        <br/>
        
        <label className='one'>
          Enter your district:
          <input 
            type="text" 
            name="district" 
            className='inputChangeAdd' 
            placeholder="Enter your district" 
            value={formData.district}
            onChange={handleChange}
            required 
          />
        </label>
        <br />
        
        <label className='one'>
          Enter your city/town:
          <input 
            type="text" 
            name="city" 
            className='inputChangeAdd' 
            placeholder="Enter your city/town" 
            value={formData.city}
            onChange={handleChange}
            required 
          />
        </label>
        <br />
        
        {error && <p className="error">{error}</p>}
        
        <button type="submit" className="btn2">Change Address</button>
      </form>
    </section>
  );
};

export default ChangeAddress;
