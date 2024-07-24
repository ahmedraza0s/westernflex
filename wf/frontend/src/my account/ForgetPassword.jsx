import React from 'react';
import './forgetPassword.css';

const ForgetPassword = () => {
    return (
        <div className="page-container">
            <div className="containerPass">
                <h3>Change Password</h3>
                <form action="/change-password" method="POST">
                    <div className="form-group-pass">
                        <label htmlFor="old-password" className="label-pass">Old Password</label>
                        <input type="password" id="old-password" name="old-password" className="input-pass" required />
                    </div>
                    <div className="form-group-pass">
                        <label htmlFor="new-password" className="label-pass">New Password</label>
                        <input type="password" id="new-password" name="new-password" className="input-pass" required />
                    </div>
                    <div className="form-group-pass">
                        <label htmlFor="confirm-password" className="label-pass">Confirm New Password</label>
                        <input type="password" id="confirm-password" name="confirm-password" className="input-pass" required />
                    </div>
                    <button type="submit" className="button-pass">Change Password</button>
                    <div className="forgot-password">
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
