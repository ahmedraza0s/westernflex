import React from 'react';
import { Link } from 'react-router-dom';
import './register.css';
import nameIcon from '../components/assets/name.png'; // Import the name image
import loginIcon from '../components/assets/loginuser.png'; // Import the user image
import passIcon from '../components/assets/password.png'; // Import the name image
import repassIcon from '../components/assets/password.png'; // Import the name image
import emailIcon from '../components/assets/email.png'; // Import the name image
import registerIcon from '../components/assets/registeruser.png'; // Import the name image




const RegisterPage = () => {
  return (
    <div className="main">
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>
              <form method="post" className="register-form" id="register-form">
                <div className="form-group">
                  <Link to="#"><img src={nameIcon} alt="no image" className="img" /></Link>
                  <input type="text" name="name" id="name" placeholder="Enter Your Name" className="input1" />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={loginIcon} alt="no image" className="img" /></Link>
                  <input type="text" name="username" id="username" placeholder="Enter your Username"  className="input1" />
                </div>
                <div className="form-group">
                  <Link to="#"><img src={passIcon} alt="no image" className="img" /></Link>
                  <input type="password" name="pass" id="pass" placeholder="Enter your Password" className="input1" />
                </div>
                <div className="form-group">
                <Link to="#"><img src={repassIcon} alt="no image" className="img" /></Link>
                <input type="password" name="re_pass" id="re_pass" placeholder="Repeat your password" className="input1" />
                </div>
                <div className="form-group">
                <Link to="#"><img src={emailIcon} alt="no image" className="img" /></Link>
                <input type="email" name="email" id="email" placeholder="Enter your Email"  className="input1"/>
                </div>
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
