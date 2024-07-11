import React, { useState } from 'react';
import axios from 'axios';

const UpdateProduct = () => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newColor, setNewColor] = useState({
    color: '',
    stock: 0,
    priority: 0,
    images: [],
    numberOfImages: 0,
  });

  const handleChange = (e) => {
    setProductId(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/product/${productId}`);
      setProduct(response.data);
    } catch (err) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/product/${productId}`, product);
      setProduct(response.data);
      setError('Product updated successfully');
    } catch (err) {
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleColorChange = (index, name, value) => {
    const updatedColors = [...product.colors];
    updatedColors[index][name] = value;
    setProduct({ ...product, colors: updatedColors });
  };

  const handleUpdateColor = async (index) => {
    setLoading(true);
    try {
      await axios.put(`/api/product/${productId}/color/${index}`, product.colors[index]);
      setError('Color updated successfully');
    } catch (err) {
      setError('Failed to update color');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteColor = async (index) => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/product/${productId}/color/${index}`);
      setProduct(response.data);
      setError('Color deleted successfully');
    } catch (err) {
      setError('Failed to delete color');
    } finally {
      setLoading(false);
    }
  };

  const handleNewColorChange = (e) => {
    const { name, value } = e.target;
    setNewColor({ ...newColor, [name]: value });
  };

  const handleAddColor = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/product/${productId}/color`, newColor);
      setProduct(response.data);
      setNewColor({
        color: '',
        stock: 0,
        priority: 0,
        images: [],
        numberOfImages: 0,
      });
      setError('Color added successfully');
    } catch (err) {
      setError('Failed to add color');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Update Product</h1>
      <input
        type="text"
        value={productId}
        onChange={handleChange}
        placeholder="Enter Product ID"
      />
      <button onClick={handleSearch}>Load Product</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {product && (
        <div>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            placeholder="Category"
          />
          <input
            type="text"
            name="subCategory"
            value={product.subCategory}
            onChange={handleInputChange}
            placeholder="SubCategory"
          />
          <input
            type="text"
            name="shortDescription"
            value={product.shortDescription}
            onChange={handleInputChange}
            placeholder="Short Description"
          />
          <textarea
            name="longDescription"
            value={product.longDescription}
            onChange={handleInputChange}
            placeholder="Long Description"
          ></textarea>
          <input
            type="number"
            name="listingPrice"
            value={product.listingPrice}
            onChange={handleInputChange}
            placeholder="Listing Price"
          />
          <input
            type="number"
            name="sellingPrice"
            value={product.sellingPrice}
            onChange={handleInputChange}
            placeholder="Selling Price"
          />
          {product.colors.map((color, index) => (
            <div key={index}>
              <h3>Color {index + 1}</h3>
              <input
                type="text"
                value={color.color}
                onChange={(e) => handleColorChange(index, 'color', e.target.value)}
                placeholder="Color"
              />
              <input
                type="number"
                value={color.stock}
                onChange={(e) => handleColorChange(index, 'stock', e.target.value)}
                placeholder="Stock"
              />
              <input
                type="number"
                value={color.priority}
                onChange={(e) => handleColorChange(index, 'priority', e.target.value)}
                placeholder="Priority"
              />
              <textarea
                value={color.images.join(', ')}
                onChange={(e) => handleColorChange(index, 'images', e.target.value.split(', '))}
                placeholder="Images (comma separated)"
              ></textarea>
              <input
                type="number"
                value={color.numberOfImages}
                onChange={(e) => handleColorChange(index, 'numberOfImages', e.target.value)}
                placeholder="Number of Images"
              />
              <button onClick={() => handleUpdateColor(index)}>Update Color</button>
              <button onClick={() => handleDeleteColor(index)}>Delete Color</button>
            </div>
          ))}
          <button onClick={handleUpdate}>Update Product</button>
          <h3>Add New Color</h3>
          <input
            type="text"
            name="color"
            value={newColor.color}
            onChange={handleNewColorChange}
            placeholder="Color"
          />
          <input
            type="number"
            name="stock"
            value={newColor.stock}
            onChange={handleNewColorChange}
            placeholder="Stock"
          />
          <input
            type="number"
            name="priority"
            value={newColor.priority}
            onChange={handleNewColorChange}
            placeholder="Priority"
          />
          <textarea
            name="images"
            value={newColor.images.join(', ')}
            onChange={(e) => handleNewColorChange({ target: { name: 'images', value: e.target.value.split(', ') } })}
            placeholder="Images (comma separated)"
          ></textarea>
          <input
            type="number"
            name="numberOfImages"
            value={newColor.numberOfImages}
            onChange={handleNewColorChange}
            placeholder="Number of Images"
          />
          <button onClick={handleAddColor}>Add Color</button>
        </div>
      )}
    </div>
  );
};

export default UpdateProduct;
