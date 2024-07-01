import React, { useState } from 'react';
import './changeAddress.css';

const ChangeAddress = () => {
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    pincode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Address Changed:', formData);
  };

  return (
    <section id="changeAdd">
      <form onSubmit={handleSubmit} className="delivery-address-change">
        <h2>Change Delivery address</h2>
        
        <label className='one'>
          Enter your address:
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
          Enter your address:
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
          Enter your city:
          <input 
            type="text" 
            name="city" 
            className='inputChangeAdd' 
            placeholder="Enter your city" 
            value={formData.city}
            onChange={handleChange}
            required 
          />
        </label>
        <br />
        
        <label className='one'>
          Enter the pincode:
          <input 
            type="number" 
            name="pincode" 
            placeholder="Enter the pincode"
            className='inputChangeAdd' 
            value={formData.pincode}
            onChange={handleChange}
            required 
          />
        </label>
        <br />
        
        <button type="submit" className="btn2">Change Address</button>
      </form>
    </section>
  );
};

export default ChangeAddress;
