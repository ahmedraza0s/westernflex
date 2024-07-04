import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductPage() {
  const [productId, setProductId] = useState('1'); // Set default productId to 1
  const [products, setProducts] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    handleSearch(); // Automatically load products for productId = 1 on component mount
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
     

      {products.length > 0 ? (
        <div>
          {products.map((product) => (
            <div key={product._id}>
              <h4>{product.name}</h4>
              <ul>
                {product.colors.map((color) => (
                  <li key={color.color}>
                    <strong>Color: {color.color}</strong>
                    <br />
                    Stock: {color.stock}
                    <br />
                    Priority: {color.priority}
                    <br />
                    {color.images.length > 0 && (
                      <img
                        src={`http://localhost:5000/${color.images[0]}`} // Display only the first image
                        alt={`${product.name} - ${color.color}`}
                        style={{ maxWidth: '100px', margin: '5px' }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found for the entered ID</p>
      )}
    </div>
  );
}

export default ProductPage;
