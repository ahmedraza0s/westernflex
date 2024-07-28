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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        setLoading(true);
        setError('');
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
          setError('Error fetching product details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleInputChange = ({ target: { name, value } }) => {
    setProductDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleTagsChange = ({ target: { value } }) => {
    setProductDetails((prevDetails) => ({ ...prevDetails, tags: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      setError('Error updating product');
    } finally {
      setLoading(false);
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
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
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
          onChange={() => setProductDetails((prevDetails) => ({ ...prevDetails, isActive: !prevDetails.isActive }))}
        />
        Is Active
      </label>
      <button type="submit" className="updateButton" disabled={loading}>
        Update Product
      </button>
    </form>
  );
};

export default UpdateRank;
