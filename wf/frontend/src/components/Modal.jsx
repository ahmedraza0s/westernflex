import React, { useRef, useEffect } from 'react';
import './modal.css';
import { Link } from 'react-router-dom';

const Modal = ({ show, onClose, children }) => {
  const modalRef = useRef();

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

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal">
        <button className="modal-close" onClick={onClose}>X</button>
        <div className="modal-content">
          {children}
      
        <Link to="/checkout">
            <button className="add-to-cart-btn" onClick={onClose} >CHECK OUT</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Modal;


