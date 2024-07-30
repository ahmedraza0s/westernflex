import React, { useEffect, useState } from 'react';
import './checkout.css';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const Checkout = () => {
  const { cart, totalAmount, updateQuantity, setCart } = useCart();
  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [existingAddresses, setExistingAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showEmptyCartPopup, setShowEmptyCartPopup] = useState(false);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExistingAddresses(response.data.addresses);
        if (response.data.addresses.length > 0) {
          setSelectedAddressId(response.data.addresses[0].addressId);
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
      }
    };

    fetchUserAddresses();
  }, []);

  useEffect(() => {
    if (showPopup || showEmptyCartPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        setShowEmptyCartPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, showEmptyCartPopup]);

  const handleDelete = (item) => {
    updateQuantity(item.title, item.color, -1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show popup if cart is empty
    if (cart.length === 0) {
      setShowEmptyCartPopup(true);
      return;
    }

    // Validate if address is selected or provided
    if (!selectedAddressId && !addingNewAddress) {
      setError('Please select or add an address.');
      return;
    }

    // Prepare the order address
    const orderAddress = addingNewAddress
      ? address
      : existingAddresses.find(addr => addr.addressId === selectedAddressId);

    const orderData = {
      address: orderAddress, // Use the selected or new address
      items: cart,
      totalAmount,
      orderStatus: 'pending',
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log('Order placed successfully');
        setCart([]); // Clear the cart
        setShowPopup(true); // Show the success popup
      } else {
        const errorData = await response.json();
        console.log('Error placing order:', errorData);
        setError('Error placing order.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error placing order.');
    }
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setAddingNewAddress(false); // Ensure adding new address mode is disabled when selecting existing address
  };

  const handleAddAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/user/update/${localStorage.getItem('username')}`, {
        addresses: [...existingAddresses, { ...address, addressId: Date.now().toString() }]
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExistingAddresses(response.data.addresses);
      setAddingNewAddress(false);
      setSelectedAddressId(response.data.addresses[response.data.addresses.length - 1].addressId);
    } catch (err) {
      console.error('Error adding address:', err);
      setError('Error adding address.');
    }
  };

  return (
    <div>
      <header className="checkout-header">
        <div className="container">
          <h1>Checkout</h1>
        </div>
      </header>

      <div className="checkout-container">
        <section className="order-summary">
          <div className="order-summary-box">
            <h2>Order Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Image</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td><img src={item.image} alt={item.title} className="checkout-image" /></td>
                    <td>{item.quantity}</td>
                    <td>{item.totalPrice.toFixed(2)}</td>
                    <td>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total">
              Total: <span>INR {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="checkout-container">
        <div className="checkout-content">
          <form onSubmit={handleSubmit}>
            <div className="delivery-address">
              <h2>1. Delivery Address</h2>
              <div>
                {existingAddresses.length > 0 && (
                  <div className="address-selection">
                    <label>Select an existing address:</label>
                    {existingAddresses.map(address => (
                      <div 
                        key={address.addressId} 
                        className={`address-box ${selectedAddressId === address.addressId ? 'selected' : ''}`}
                        onClick={() => handleAddressSelect(address.addressId)}
                      >
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{address.city}, {address.state}, {address.postalCode}</p>
                        <p>{address.country}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" onClick={() => setAddingNewAddress(true)}>Add New Address</button>
                {existingAddresses.length === 0 && !addingNewAddress && <div>No addresses found.</div>}
                {addingNewAddress && (
                  <div className="new-address-form">
                    <h3>Add New Address</h3>
                    <div>
                      <label>Address Line 1</label>
                      <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleChange} required />
                    </div>
                    <div>
                      <label>Address Line 2</label>
                      <input type="text" name="addressLine2" value={address.addressLine2} onChange={handleChange} />
                    </div>
                    <div>
                      <label>City</label>
                      <input type="text" name="city" value={address.city} onChange={handleChange} required />
                    </div>
                    <div>
                      <label>State</label>
                      <input type="text" name="state" value={address.state} onChange={handleChange} required />
                    </div>
                    <div>
                      <label>Postal Code</label>
                      <input type="text" name="postalCode" value={address.postalCode} onChange={handleChange} required />
                    </div>
                    <div>
                      <label>Country</label>
                      <input type="text" name="country" value={address.country} onChange={handleChange} required />
                    </div>
                    <button type="button" onClick={handleAddAddress}>Save Address</button>
                    <button type="button" onClick={() => setAddingNewAddress(false)}>Cancel</button>
                  </div>
                )}
                {error && <div className="error">{error}</div>}
              </div>
            </div>

            <div className="payment-method">
              <h2>2. Select a Payment Method</h2><br />
              <label>Cash on Delivery</label><br />
              <button type="submit" className="order">Place Order</button>
            </div>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Your order has been placed successfully!</p>
          </div>
        </div>
      )}

      {showEmptyCartPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Please select the product first.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
