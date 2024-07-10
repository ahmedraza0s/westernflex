import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import nameIcon from '../components/assets/name.png';
import loginIcon from '../components/assets/loginuser.png';
import passIcon from '../components/assets/password.png';
import repassIcon from '../components/assets/password.png';
import emailIcon from '../components/assets/email.png';
import registerIcon from '../components/assets/registeruser.png';
import phoneIcon from '../components/assets/phoneCall.png';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
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
              <form method="post" className="register-form" id="register-form" onSubmit={handleSubmit}>
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
                {error && <div className="error-message">{error}</div>}
                <div className="form-group form-button">
                  <input type="submit" name="signup" id="signup" className="form-submit" value="Register" />
                </div>
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
      </section>
    </div>
  );
}

export default RegisterPage;
