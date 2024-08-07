// UpdateOrder.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Invoice from './Invoice'; // Import the Invoice component

const UpdateOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [orderDetails, setOrderDetails] = useState({
        orderStatus: '',
        orderDate: '',
        estimatedDelivery: '',
        items: [],
        orderHistory: [],
        user: { fname: '', lname: '', username: '' },
        orderAddress: { addressline1: '', addressline2: '', city: '', state: '', postalCode: '', country: '' }
    });
    const [newHistoryEntry, setNewHistoryEntry] = useState({
        status: '',
        location: ''
    });
    const [showInvoice, setShowInvoice] = useState(false); // State to control invoice visibility

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (orderId) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`/api/admin/orders/${orderId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.data.order) {
                        const { orderStatus, orderDate, estimatedDelivery, orderHistory, items, user, orderAddress } = response.data.order;
                        setOrderDetails({
                            orderStatus,
                            orderDate: orderDate ? new Date(orderDate).toISOString().split('T')[0] : '',
                            estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery).toISOString().split('T')[0] : '',
                            items: items || [],
                            orderHistory: orderHistory || [],
                            user: user || { fname: '', lname: '', username: '' },
                            orderAddress: orderAddress || { addressline1: '', addressline2: '', city: '', state: '', postalCode: '', country: '' }
                        });
                    } else {
                        alert('Order not found.');
                    }
                } catch (error) {
                    console.error('Error fetching order details:', error);
                    alert('Order not found or an error occurred.');
                }
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails({ ...orderDetails, [name]: value });
    };

    const handleStatusChange = (e) => {
        setOrderDetails({ ...orderDetails, orderStatus: e.target.value });
    };

    const handleHistoryChange = (e) => {
        const { name, value } = e.target;
        setNewHistoryEntry({ ...newHistoryEntry, [name]: value });
    };

    const addHistoryEntry = () => {
        setOrderDetails({
            ...orderDetails,
            orderHistory: [...orderDetails.orderHistory, { ...newHistoryEntry, date: new Date() }]
        });
        setNewHistoryEntry({
            status: '',
            location: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/orders/${orderId}`, {
                orderStatus: orderDetails.orderStatus,
                orderstatusdate: new Date(), // Adding the order status date here
                estimatedDelivery: orderDetails.estimatedDelivery,
                orderHistory: orderDetails.orderHistory,
                items: orderDetails.items,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Order updated successfully');
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order');
        }
    };

    const handleGenerateInvoice = () => {
        setShowInvoice(true);
    };

    const handleCloseInvoice = () => {
        setShowInvoice(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="order-update-container">
                <h2>Update Order</h2>
                <div>
                    <label>Order ID:</label>
                    <input
                        type="text"
                        name="orderId"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        required
                    />
                    <button type="button" onClick={() => setOrderId(orderId)}>Fetch Order</button>
                </div>
                {orderDetails && (
                    <div className="order-details">
                        <h3>Order Details</h3>
                        <p><strong>Order ID:</strong> {orderId}</p>
                        <p><strong>Status:</strong>
                            <select
                                name="orderStatus"
                                value={orderDetails.orderStatus}
                                onChange={handleStatusChange}
                            >
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </p>
                        <p><strong>Order Date:</strong> {orderDetails.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString() : ''}</p>
                        <p><strong>Estimated Delivery Date:</strong>
                            <input
                                type="date"
                                name="estimatedDelivery"
                                value={orderDetails.estimatedDelivery}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p><strong>User Name:</strong> {orderDetails.user.fname} {orderDetails.user.lname}</p>
                        <p><strong>Username:</strong> {orderDetails.user.username}</p>
                        <h4>Order Address</h4>
                        <p><strong>Address Line 1:</strong> {orderDetails.orderAddress.addressline1}</p>
                        <p><strong>Address Line 2:</strong> {orderDetails.orderAddress.addressline2}</p>
                        <p><strong>City:</strong> {orderDetails.orderAddress.city}</p>
                        <p><strong>State:</strong> {orderDetails.orderAddress.state}</p>
                        <p><strong>Postal Code:</strong> {orderDetails.orderAddress.postalCode}</p>
                        <p><strong>Country:</strong> {orderDetails.orderAddress.country}</p>
                        <h4>Order Items</h4>
                        <ul>
                            {orderDetails.items && orderDetails.items.map(item => (
                                <li key={item.productId}>
                                    <p><strong>Product Name:</strong> {item.productName}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Price:</strong> {item.price}</p>
                                    <p><strong>Color:</strong> {item.color}</p>
                                </li>
                            ))}
                        </ul>
                        <h4>Order History</h4>
                        <ul>
                            {orderDetails.orderHistory && orderDetails.orderHistory.map((history, index) => (
                                <li key={index}>
                                    <p><strong>Status:</strong> {history.status}</p>
                                    <p><strong>Location:</strong> {history.location}</p>
                                    <p><strong>Date:</strong> {history.date ? new Date(history.date).toLocaleDateString() : ''}</p>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <label>Status:</label>
                            <input
                                type="text"
                                name="status"
                                value={newHistoryEntry.status}
                                onChange={handleHistoryChange}
                            />
                        </div>
                        <div>
                            <label>Location:</label>
                            <input
                                type="text"
                                name="location"
                                value={newHistoryEntry.location}
                                onChange={handleHistoryChange}
                            />
                        </div>
                        <button type="button" onClick={addHistoryEntry}>Add History Entry</button>
                        <button type="submit">Update Order</button>
                        <button type="button" onClick={handleGenerateInvoice}>Generate Invoice</button>
                    </div>
                )}
            </form>

            {showInvoice && (
                <div className="invoice-overlay">
                    <div className="invoice-container">
                        <Invoice order={orderDetails} />
                        <div className="invoice-buttons">
                            <button type="button" onClick={handleCloseInvoice}>Close Invoice</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateOrder;
