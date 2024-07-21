import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateRank = () => {
  const [productId, setProductId] = useState('');
  const [productDetails, setProductDetails] = useState({
    tags: '',
    metaTitle: '',
    metaDescription: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/product/${productId}`);
          const { tags, metaTitle, metaDescription, isActive } = response.data;
          setProductDetails({
            tags: tags.join(','),
            metaTitle,
            metaDescription,
            isActive,
          });
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({ ...productDetails, [name]: value });
  };

  const handleTagsChange = (e) => {
    setProductDetails({ ...productDetails, tags: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/product/${productId}`, {
        ...productDetails,
        tags: productDetails.tags.split(','),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formUpdate">
      <input
        type="text"
        name="productId"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        placeholder="Product ID"
        className="inputProduct"
        required
      />
      <textarea
        name="tags"
        value={productDetails.tags}
        onChange={handleTagsChange}
        placeholder="Tags (comma separated)"
        className="textArea"
        required
      />
      <input
        type="text"
        name="metaTitle"
        value={productDetails.metaTitle}
        onChange={handleInputChange}
        placeholder="Meta Title"
        className="inputProduct"
        required
      />
      <textarea
        name="metaDescription"
        value={productDetails.metaDescription}
        onChange={handleInputChange}
        placeholder="Meta Description"
        className="textArea"
        required
      />
      <label>
        <input
          type="checkbox"
          name="isActive"
          checked={productDetails.isActive}
          onChange={() => setProductDetails({ ...productDetails, isActive: !productDetails.isActive })}
        />
        Is Active
      </label>
      <button type="submit" className="updateButton">
        Update Product
      </button>
    </form>
  );
};

export default UpdateRank;
