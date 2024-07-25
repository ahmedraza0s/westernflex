import React, { useState } from 'react';
import './forgetPassword.css';

const ForgetPassword = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        try {
            const response = await fetch('/api/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust if your token is stored elsewhere
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: formData.get('oldPassword'),
                    newPassword: formData.get('newPassword'),
                    confirmPassword: formData.get('confirmPassword'),
                }),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage(result.message);
                setError('');
            } else {
                setError(result.error);
                setMessage('');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            setMessage('');
        }
    };

    return (
        <div className="page-container">
            <div className="containerPass">
                <h3>Change Password</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-pass">
                        <label htmlFor="old-password" className="label-pass">Old Password</label>
                        <input type="password" id="old-password" name="oldPassword" className="input-pass" required />
                    </div>
                    <div className="form-group-pass">
                        <label htmlFor="new-password" className="label-pass">New Password</label>
                        <input type="password" id="new-password" name="newPassword" className="input-pass" required />
                    </div>
                    <div className="form-group-pass">
                        <label htmlFor="confirm-password" className="label-pass">Confirm New Password</label>
                        <input type="password" id="confirm-password" name="confirmPassword" className="input-pass" required />
                    </div>
                    <button type="submit" className="button-pass">Change Password</button>
                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
