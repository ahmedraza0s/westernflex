import React, { useRef, useEffect } from 'react';
import './modal.css';

const Modal = ({ show, onClose, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
        </div>
      </div>
    </div>
  );
};

export default Modal;