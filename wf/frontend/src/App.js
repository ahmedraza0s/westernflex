import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './footer/Footer';
import './components/navbar/navbar.css';
import Shop from './pages/Shop';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangeUserDetails from './my account/ChangeUserDetails';  // my account folder pages 
import MyOrders from './my account/MyOrders';
import UserProfile from './my account/UserProfile';
import ProductDetails from './pages/ProductDetails';
import AdminLogin from './admin/AdminLogin';
import AdminPage from './admin/AdminPage'; // import the AdminPage component
import UserOrders from './admin/UserOrders';
import UpdateOrder from './admin/UpdateOrder';
import UpdateRank from './admin/UpdateRank';
import AddImageToProduct from './admin/AddImageToProduct';
import AdminRegister from './admin/AdminRegister';
import ProductList from './admin/ProductList';
import Cart from './pages/Cart'; // Import the Cart component
import UploadProduct from './admin/UploadProduct';
import Dashboard from './admin/Dashboard'; // Import the Dashboard component
import UpdateProduct from './admin/UpdateProduct';
import Products from './admin/Products'; // Import the Products component
import Orders from './admin/Orders'; // Import the Orders component
import ManageUsers from './admin/ManageUsers';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import ProtectedRoute from './routes/ProtectedRoute'; // Import ProtectedRoute
import Account from './my account/Account';
import ForgetPassword from './my account/ForgetPassword';//Import The Forget Password component

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <AuthProvider>
          <Router>
          
            <Navbar />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/change-user-details" element={<ChangeUserDetails />} />
              <Route path="/product/:title" element={<ProductDetails />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/account/*" element={<Account />} />
              <Route path="/User-Profile" element={<UserProfile />} />
              <Route path="/My-orders" element={<MyOrders />} />
              <Route path='/forget-password' element={<ForgetPassword/>}/>
    
            

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="manage-users" element={<ManageUsers />} />
                <Route path="Add-Image" element={<AddImageToProduct />} />
                <Route path="product-list" element={<ProductList />} />
                <Route path="admin-register" element={<AdminRegister />} />
                <Route path="upload-product" element={<UploadProduct />} />
                <Route path="update-product" element={<UpdateProduct />} />
                <Route path="update-Metadata" element={<UpdateRank />} />
                <Route path="update-order" element={<UpdateOrder />} />
                <Route path="user-order" element={<UserOrders />} />
              </Route>
            </Routes>
            <Footer />
          </Router>
        </AuthProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
