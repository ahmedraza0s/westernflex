import React, { useState } from 'react';
import axios from 'axios';

const AddImageToProduct = () => {
  const [productId, setProductId] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('color', color);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/add-image-to-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image added to product successfully');
    } catch (error) {
      console.error('Error adding image to product:', error);
      alert('Error adding image to product');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        />
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        >
          <option value="">Select Color</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="white">White</option>
          <option value="black">Black</option>
          <option value="grey">Grey</option>
          {/* Add more color options as needed */}
        </select>
        <input type="file" onChange={handleImageChange} required />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
};

export default AddImageToProduct;
