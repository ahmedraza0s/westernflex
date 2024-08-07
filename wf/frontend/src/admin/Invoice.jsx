import React from 'react';
import './invoice.css'; // Ensure this file contains both screen and print styles

const Invoice = ({ order }) => {
    const handlePrint = () => {
        window.print();
    };

    // Ensure order is defined and has the expected properties
    const orderId = order?.orderId || '[Order ID]';
    const invoiceDate = new Date().toLocaleDateString();
    const userName = order?.user ? `${order.user.fname} ${order.user.lname}` : '[Client Name]';
    const clientAddress = order?.orderAddress ? `${order.orderAddress.addressline1}, ${order.orderAddress.city}, ${order.orderAddress.state}, ${order.orderAddress.postalCode}, ${order.orderAddress.country}` : '[Client Address]';
    const items = order?.items || [];
    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="invoice-container">
            <header>
                <div className="header-content">
                    <div className="logo">
                        <img src="wflogo.jpeg" alt="Western Flex Logo" />
                    </div>
                    <div className="company-details">
                        <h1>Western Flex</h1>
                        <p>Address: Building No./Flat No.: 212B, FLOOR-GRD </p>
                        <p>Abubakar Chawl DHARAVI MAIN ROAD,</p>
                        <p>BAGICHA COMPOUND Mumbai Maharashtra 400017</p>
                        <p>Phone: [Your Phone Number]</p>
                        <p>GST Number: [27PMQPS9339D1ZZ]</p>
                    </div>
                </div>
            </header>
            
            <section className="invoice-details">
                <h2>Invoice</h2>
                <p>Invoice Number: {orderId}</p>
                <p>Date: {invoiceDate}</p>
            </section>

            <section className="client-details">
                <h3>Client Details</h3>
                <p>Name: {userName}</p>
                <p>Address: {clientAddress}</p>
                <p>Phone: [Client Phone]</p>
            </section>

            <section className="invoice-items">
                <h3>Items</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Color</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Discount</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.productName}</td>
                                <td>{item.color}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>[Discount]</td>
                                <td>{item.price * item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="invoice-total">
                <h3>Total</h3>
                <p>Total Amount: {totalAmount}</p>
            </section>
            
            {/* System Generated Note */}
            <div className="system-generated-note">
                <p>This is a system-generated invoice and does not require a signature.</p>
            </div>

            <footer>
                <p>Thank you for shopping!</p>
            </footer>
            
            {/* Print Button */}
            <div className="print-button">
                <button onClick={handlePrint}>Print Invoice</button>
            </div>
        </div>
    );
};

export default Invoice;