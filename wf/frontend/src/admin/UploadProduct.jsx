import React, { useState } from 'react';
import axios from 'axios';
import './uploadproduct.css'; // Import CSS file for styles

const UploadProduct = () => {
  const [productDetails, setProductDetails] = useState({
    name: '',
    category: '',
    subCategory: '',
    shortDescription: '',
    longDescription: '',
    listingPrice: '',
    sellingPrice: '',
    productId: '',
  });

  const [colors, setColors] = useState([{ color: '', stock: '', priority: '', numberOfImages: '' }]);

  const handleProductDetailsChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({ ...productDetails, [name]: value });
  };

  const handleColorChange = (index, e) => {
    const newColors = [...colors];
    newColors[index][e.target.name] = e.target.value;
    setColors(newColors);
  };

  const handleAddColor = () => {
    setColors([...colors, { color: '', stock: '', priority: '', numberOfImages: '' }]);
  };

  const handleRemoveColor = (index) => {
    const newColors = [...colors];
    newColors.splice(index, 1);
    setColors(newColors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(productDetails).forEach((key) => {
      formData.append(key, productDetails[key]);
    });
    formData.append('colors', JSON.stringify(colors));

    try {
      await axios.post('http://localhost:5000/upload-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product uploaded successfully');
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Error uploading product');
    }
  };

  const colorOptions = [
    { value: '', label: 'Select Color' },
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'black', label: 'Black' },
    { value: 'grey', label: 'Grey' },
    { value: 'white', label: 'White' },
    // Add more color options as needed
  ];

  return (
    <form onSubmit={handleSubmit} className='formUpload'>
      <input
        type="text"
        name="name"
        className='inputProduct'
        value={productDetails.name}
        onChange={handleProductDetailsChange}
        placeholder="Name"
        required
      />
      <input
        type="text"
        name="category"
        className='inputProduct'
        value={productDetails.category}
        onChange={handleProductDetailsChange}
        placeholder="Category"
        required
      />
      <input
        type="text"
        name="subCategory"
        className='inputProduct'
        value={productDetails.subCategory}
        onChange={handleProductDetailsChange}
        placeholder="Subcategory"
        required
      />
      <input
        type="text"
        name="shortDescription"
        className='inputProduct'
        value={productDetails.shortDescription}
        onChange={handleProductDetailsChange}
        placeholder="Short Description"
        required
      />
      <textarea
        name="longDescription"
        value={productDetails.longDescription}
        onChange={handleProductDetailsChange}
        placeholder="Long Description"
        className='textArea'
        required
      />
      <input
        type="number"
        name="listingPrice"
        className='inputProduct'
        value={productDetails.listingPrice}
        onChange={handleProductDetailsChange}
        placeholder="Listing Price"
        required
      />
      <input
        type="number"
        name="sellingPrice"
        className='inputProduct'
        value={productDetails.sellingPrice}
        onChange={handleProductDetailsChange}
        placeholder="Selling Price"
        required
      />
      <input
        type="text"
        name="productId"
        className='inputProduct'
        value={productDetails.productId}
        onChange={handleProductDetailsChange}
        placeholder="Product ID"
        required
      />
      {colors.map((color, index) => (
        <div key={index} className='divColor'>
          <select
            name="color"
            value={color.color}
            className='colorSelect'
            onChange={(e) => handleColorChange(index, e)}
            required
          >
            {colorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="stock"
            className='inputProduct'
            value={color.stock}
            onChange={(e) => handleColorChange(index, e)}
            placeholder="Stock"
            required
          />
          <input
            type="number"
            name="priority"
            className='inputProduct'
            value={color.priority}
            onChange={(e) => handleColorChange(index, e)}
            placeholder="Priority"
            required
          />
          <button type="button" className='remColor' onClick={() => handleRemoveColor(index)}>
            Remove Color
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddColor} className='uploadButton'>
        Add Color
      </button>
    
      <button type="submit" className='uploadButton1'>Upload Product</button>
    </form>
  );
};


export default UploadProduct;
