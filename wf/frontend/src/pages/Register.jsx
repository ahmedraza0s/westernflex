import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import nameIcon from '../components/assets/name.png';
import loginIcon from '../components/assets/loginuser.png';
import passIcon from '../components/assets/password.png';
import emailIcon from '../components/assets/email.png';
import registerIcon from '../components/assets/registeruser.png';
import phoneIcon from '../components/assets/phoneCall.png';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    username: '',
    password: '',
    re_pass: '',
    email: '',
    phno: ''
  });
  const [error, setError] = useState('');
  const [errorField, setErrorField] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePhoneNumber = (phno) => {
    return phno.length === 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(formData.phno)) {
      setError('Phone number must be 10 digits');
      setErrorField('phno');
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
        alert('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message);
        setErrorField(data.field);
        alert(data.message);
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
                  <Link to="#"><img src={nameIcon} alt="icon" className="img" /></Link>
                  <input
                    type="text"
                    name="fname"
                    id="fname"
                    placeholder="First Name"
                    className={`input1 ${errorField === 'fname' ? 'error-input' : ''}`}
                    value={formData.fname}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={nameIcon} alt="icon" className="img" /></Link>
                  <input
                    type="text"
                    name="lname"
                    id="lname"
                    placeholder="Last Name"
                    className={`input1 ${errorField === 'lname' ? 'error-input' : ''}`}
                    value={formData.lname}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={loginIcon} alt="icon" className="img" /></Link>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your Username"
                    className={`input1 ${errorField === 'username' ? 'error-input' : ''}`}
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={passIcon} alt="icon" className="img" /></Link>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your Password"
                    className={`input1 ${errorField === 'password' ? 'error-input' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={passIcon} alt="icon" className="img" /></Link>
                  <input
                    type="password"
                    name="re_pass"
                    id="re_pass"
                    placeholder="Repeat your password"
                    className={`input1 ${errorField === 're_pass' ? 'error-input' : ''}`}
                    value={formData.re_pass}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={emailIcon} alt="icon" className="img" /></Link>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your Email"
                    className={`input1 ${errorField === 'email' ? 'error-input' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={phoneIcon} alt="icon" className="img" /></Link>
                  <input
                    type="text"
                    name="phno"
                    id="phno"
                    placeholder="Enter your Phone no."
                    className={`input1 ${errorField === 'phno' ? 'error-input' : ''}`}
                    value={formData.phno}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group form-button">
                  <button type="submit" className="form-submit">Register</button>
                </div>
                {error && <div className="error-message">{error}</div>}
              </form>
            </div>
            <div className="signup-image">
              <figure><img src={registerIcon} alt="register" /></figure>
              <Link to="/login" className="signup-image-link">I am already member</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
