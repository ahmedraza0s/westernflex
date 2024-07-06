import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import AdminNavbar from './admin/AdminNavbar';
import './components/navbar/navbar.css';
import Shop from './pages/Shop';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangeAddress from './my account/ChangeAddress';
import ProductDetails from './pages/ProductDetails';
import AdminLogin from './admin/AdminLogin';
import AdminPage from './admin/AdminPage';
import AddImageToProduct from './admin/AddImageToProduct';
import AdminRegister from './admin/AdminRegister';
import ProductList from './admin/ProductList';
import Cart from './pages/Cart';
import UploadProduct from './admin/UploadProduct';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import Orders from './admin/Orders';
import Users from './admin/Users';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoadProductById from './pages/LoadProductById';

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
              <Route path="/change-address" element={<ChangeAddress />} />
              <Route path="/product/:title" element={<ProductDetails />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/byid" element={<LoadProductById />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute element={<AdminNavbar />} />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="users" element={<Users />} />
                <Route path="upload-product" element={<UploadProduct />} />
                <Route path="add-image" element={<AddImageToProduct />} />
                <Route path="product-list" element={<ProductList />} />
                <Route path="admin-register" element={<AdminRegister />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
