import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import nameIcon from '../components/assets/name.png';
import loginIcon from '../components/assets/loginuser.png';
import passIcon from '../components/assets/password.png';
import repassIcon from '../components/assets/password.png';
import emailIcon from '../components/assets/email.png';
import registerIcon from '../components/assets/registeruser.png';
import phoneIcon from '../components/assets/phoneCall.png';
import { auth } from '../firebase';
import firebase from 'firebase/compat/app';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    re_pass: '',
    email: '',
    phno: ''
  });
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecaptcha = () => {
      if (!window.recaptchaVerifier) {
        const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          size: 'invisible',
          callback: (response) => {
            console.log('Recaptcha verified', response);
          },
          'expired-callback': () => {
            console.log('Recaptcha expired');
          }
        });
        window.recaptchaVerifier = recaptchaVerifier;
      }
    };

    loadRecaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.re_pass) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.username || !formData.password || !formData.email || !formData.name || !formData.phno) {
      setError("All fields are required");
      return;
    }

    try {
      const phoneNumber = `+${formData.phno}`; // Ensure the phone number is in the correct format
      const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier);
      setVerificationId(confirmationResult.verificationId);
      setShowOtpInput(true);
      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Error during signInWithPhoneNumber:', error);
      alert(`Failed to send OTP: ${error.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      console.log('Verifying OTP:', otp);
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
      await auth.signInWithCredential(credential);
      console.log('Phone number verified successfully');
      alert('Phone number verified!');
      handleSubmit(); // Submit the form data to the server after OTP verification
    } catch (error) {
      console.error('Error during signInWithCredential:', error);
      alert(`Failed to verify OTP: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', formData.name);
        navigate('/');
        window.location.reload(); // Refresh the page
      } else {
        setError(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error registering user');
    }
  };

  return (
    <div className="main">
      <section className="signup">
        <div className="register-container">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>
              <form method="post" className="register-form" id="register-form" onSubmit={handleSendOtp}>
                <div className="form-group">
                  <Link to="#"><img src={nameIcon} alt="no image" className="img" /></Link>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter Your Name"
                    className="input1"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={loginIcon} alt="no image" className="img" /></Link>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your Username"
                    className="input1"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={passIcon} alt="no image" className="img" /></Link>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your Password"
                    className="input1"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={repassIcon} alt="no image" className="img" /></Link>
                  <input
                    type="password"
                    name="re_pass"
                    id="re_pass"
                    placeholder="Repeat your password"
                    className="input1"
                    value={formData.re_pass}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={emailIcon} alt="no image" className="img" /></Link>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your Email"
                    className="input1"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={phoneIcon} alt="no image" className="img" /></Link>
                  <input
                    type="text"
                    name="phno"
                    id="phno"
                    placeholder="Enter your Phone no."
                    className="input1"
                    value={formData.phno}
                    onChange={handleChange}
                    required
                  />
                </div>
                {showOtpInput && (
                  <>
                    <div className="form-group">
                      <input
                        type="text"
                        name="otp"
                        id="otp"
                        placeholder="Enter OTP"
                        className="input1"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group form-button">
                      <button type="button" onClick={handleVerifyOtp} className="form-submit">Verify OTP</button>
                    </div>
                  </>
                )}
                {!showOtpInput && (
                  <div className="form-group form-button">
                    <button type="submit" className="form-submit">Send OTP</button>
                  </div>
                )}
                {error && <div className="error-message">{error}</div>}
              </form>
            </div>
            <div className="signup-image">
              <figure>
                <Link to="#"><img src={registerIcon} alt="sign up" /></Link>
              </figure>
              <Link to="/login" className="signup-image-link">I am already member</Link>
            </div>
          </div>
        </div>
        <div id="recaptcha-container"></div>
      </section>
    </div>
  );
};

export default RegisterPage;
