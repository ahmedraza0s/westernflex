import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductList.css'; // Import your CSS file

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleUpdateStock = async (productId, colorIndex, newStock) => {
    try {
      await axios.patch(`http://localhost:5000/products/${productId}/colors/${colorIndex}`, { stock: newStock });
      const updatedProducts = products.map(product => {
        if (product._id === productId) {
          const updatedColors = product.colors.map((color, index) => {
            if (index === colorIndex) {
              return { ...color, stock: newStock };
            }
            return color;
          });
          return { ...product, colors: updatedColors };
        }
        return product;
      });
      setProducts(updatedProducts);
      // alert('Stock updated successfully'); // Remove alert for auto-update
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  // Function to handle input change for stock
  const handleStockChange = (productId, colorIndex, newStock) => {
    const updatedProducts = products.map(product => {
      if (product._id === productId) {
        const updatedColors = product.colors.map((color, index) => {
          if (index === colorIndex) {
            return { ...color, stock: newStock };
          }
          return color;
        });
        return { ...product, colors: updatedColors };
      }
      return product;
    });
    setProducts(updatedProducts);
    handleUpdateStock(productId, colorIndex, newStock); // Call update function on input change
  };

  return (
    <div>
      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Sub Category</th>
            <th>Short Description</th>
            <th>Long Description</th>
            <th>Listing Price</th>
            <th>Selling Price</th>
            <th>Colors</th>
            <th>Image</th>
            <th>Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.subCategory}</td>
              <td>{product.shortDescription}</td>
              <td>{product.longDescription}</td>
              <td>{product.listingPrice}</td>
              <td>{product.sellingPrice}</td>
              <td>
                <ul>
                  {product.colors.map((color, index) => (
                    <li key={index}>
                      <strong>{color.color}</strong> - Stock: {color.stock}, Priority: {color.priority}
                      <input
                        type="number"
                        value={color.stock}
                        onChange={(e) => handleStockChange(product._id, index, parseInt(e.target.value, 10))}
                        placeholder="New Stock"
                      />
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="small-images">
                  {product.colors.map((color, index) => (
                    <li key={index}>
                      <strong>{color.color}</strong>
                      {color.images.length > 0 && (
                        <img src={`http://localhost:5000/${color.images[0]}`} alt={`Color ${color.color} Image`} />
                      )}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
