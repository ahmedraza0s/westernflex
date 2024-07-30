import React from 'react';
import './footer.css';
import secureCheckout from '../components/assets/secure-checkout.png';
import freeDelivery from '../components/assets/free-delivery.png';
import cashOn from '../components/assets/cash-on-delivery.png';
import domesticShipping from '../components/assets/domestic-shipping.png';
import qualityGuarantee from '../components/assets/quality-guarantee.png';
import logoWf from '../components/assets/logo.jpg';
import linkedinImg from '../components/assets/linkedin.png';
import instaImg from '../components/assets/instagram.png';
import facebookImg from '../components/assets/facebook.png';

const Footer = () => {
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
                    <form className="contact-form">
                        <label>
                            Name
                            <input type="text" name="name" />
                        </label>
                        <label>
                            E-mail
                            <input type="email" name="email" />
                        </label>
                        <label>
                            Phone
                            <input type="tel" name="phone" />
                        </label>
                        <label>
                            Message
                            <textarea name="message"></textarea>
                        </label>
                        <button type="submit" className='sendBtn'>Send</button>
                    </form>
                </div>
            </div>        </footer>
    );
};

export default Footer;
