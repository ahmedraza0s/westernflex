import React, { useRef, useEffect } from 'react';
import './modal.css';
import { Link, useNavigate } from 'react-router-dom';

const Modal = ({ show, onClose, children }) => {
  const modalRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.keyCode === 27) { // Close modal on ESC key press
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, onClose]);

  const handleCheckout = () => {
    if (isLoggedIn()) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
    onClose(); // Close the modal after navigation
  };

  const isLoggedIn = () => {
    // Check your authentication state here, for example:
    return localStorage.getItem('token') !== null;
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal">
        <button className="modal-close" onClick={onClose}>X</button>
        <div className="modal-content">
          {children}
          <button className="add-to-cart-btn" onClick={handleCheckout}>
            CHECK OUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
