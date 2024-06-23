import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './login.css'; // Ensure this file exists with the necessary styles
import loginIcon from '../components/assets/loginuser.png'; // Import the loginuser image
import googleIcon from '../components/assets/google.png'; // Import the google image
import facebookIcon from '../components/assets/facebook.png'; // Import the facebook image
import twitterIcon from '../components/assets/twitter.png'; // Import the twitter image
import userIcon from '../components/assets/user1.png'; // Import the twitter image
import passwordIcon from '../components/assets/password.png'; // Import the twitter image





const Login = () => {
  return (
    <div className="main">
      <section className="sign-in">
        <div className="container">
          <div className="signin-content">
            <div className="signin-image">
              <figure>
              
                <Link to="#"><img src={userIcon} alt="sign up" /></Link>
              </figure>
              <Link to="/register" className="signup-image-link">Create an account</Link>
            </div>

            <div className="signin-form">
              <h2 className="form-title">Sign-in</h2>
              <form method="post" action="" className="register-form" id="login-form">
                <div className="form-group">
                  <Link to="#"><img src={loginIcon} alt="user" className="img" /></Link>
                  <input type="text" name="username" id="username" placeholder="Enter your username" className="input2"/>
                </div>
                <div className="form-group">
                  <Link to="#"><img src={passwordIcon} alt="password" className="img" /></Link>
                  <input type="password" name="password" id="password" placeholder="Enter your password" className="input2" />
                </div>
                <div className="forget">
                  <Link to="#"><h>Forget Password</h></Link>
                </div>
                <div className="form-group form-button">
                  <input type="submit" name="signin" id="signin" className="form-submit" value="Log in" />
                </div>
              </form>
              
              <div className="social-login">
                <span className="social-label">Or login with</span>
                <ul className="socials">
                  <li><Link to="#"><img src={googleIcon} alt="google" className="social-logo" /></Link></li>
                  <li><Link to="#"><img src={facebookIcon} alt="facebook" className="social-logo" /></Link></li>
                  <li><Link to="#"><img src={twitterIcon} alt="twitter" className="social-logo" /></Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
