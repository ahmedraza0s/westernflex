import React, { useState } from 'react';
import './footer.css';
import secureCheckout from '../components/assets/secure-checkout.png';
import freeDelivery from '../components/assets/free-delivery.png';
import cashOn from '../components/assets/cash-on-delivery.png';
import domesticShipping from '../components/assets/domestic-shipping.png';
import qualityGuarantee from '../components/assets/quality-guarantee.png';
import easyReturn from '../components/assets/refund.png';
import logoWf from '../components/assets/logo.jpg';
import linkedinImg from '../components/assets/linkedin.png';
import instaImg from '../components/assets/instagram.png';
import facebookImg from '../components/assets/facebook.png';

const Footer = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/submit-query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.status === 201) {
                setResponseMessage(data.message);
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setResponseMessage(data.message);
            }
        } catch (error) {
            setResponseMessage('Error submitting query');
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-item">
                    <img src={secureCheckout} alt="sign up" />
                    <p>Secure Checkout</p>
                </div>
                <div className="footer-item">
                    <img src={freeDelivery} alt="Free Shipping" />
                    <p>Free Shipping</p>
                </div>
                <div className="footer-item">
                    <img src={easyReturn} alt="Quality Guaranteed" />
                    <p>Easy Return within 4-5 days</p>
                </div>
                <div className="footer-item">
                    <img src={cashOn} alt="Cash On Delivery" />
                    <p>Cash On Delivery</p>
                </div>
                <div className="footer-item">
                    <img src={domesticShipping} alt="5-7 Days Domestic Shipping" />
                    <p>5-7 Days Domestic Shipping</p>
                </div>
                <div className="footer-item">
                    <img src={qualityGuarantee} alt="Quality Guaranteed" />
                    <p>Quality Guaranteed</p>
                </div>
            </div>
            <div className="footer-container">
                <div className="footer-section">
                    <img src={logoWf} alt="Logo" className="logoWfFooter" />
                    <h3>FOLLOW</h3>
                    <div className="social-icons-footer">
                        <a href="#"><img src={linkedinImg} alt="Linkedin" /></a>
                        <a href="#"><img src={instaImg} alt="Instagram" /></a>
                        <a href="#"><img src={facebookImg} alt="Facebook" /></a>
                    </div>
                    <address>
                        <p>Address:-</p>
                        <p>India Maharashta</p>
                        <p>ShivajiNagar Pune</p>
                    </address>
                    <div className="contacts">
                        <p>Email: support@westernflex.com</p>
                        <p>Phone: +91 7709037498</p>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>GET IN TOUCH</h3>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <label>
                            Name
                            <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        </label>
                        <label>
                            E-mail
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </label>
                        <label>
                            Phone
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                        </label>
                        <label>
                            Message
                            <textarea name="message" value={formData.message} onChange={handleChange}></textarea>
                        </label>
                        <button type="submit" className='sendBtn'>Send</button>
                    </form>
                    {responseMessage && <p>{responseMessage}</p>}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
