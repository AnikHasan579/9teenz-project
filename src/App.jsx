import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import { ThemeProvider } from './components/ThemeContext';  // Global Theme
import ScrollToTop from './components/ScrollToTop';       // Scroll to top on route change
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';         // Floating Toggle Button
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import UserLogin from './pages/UserLogin';
import ForgotPassword from './pages/ForgotPassword';
import Checkout from './pages/Checkout';
import GuestOrder from './pages/GuestOrder';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import AdminPanel from './pages/admin/AdminPanel';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import ThreeScene from './pages/ThreeScene';
import TryOn from './pages/TryOn';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <UserAuthProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              {/* Scroll to top on every route change */}
              <ScrollToTop />

              <div className="app-wrapper">
                <Navbar />

                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Products Routes */}
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/3d" element={<ThreeScene />} />
                    <Route path="/tryon" element={<TryOn />} />

                    {/* Cart & Checkout */}
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/guest-order" element={<GuestOrder />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/user-login" element={<UserLogin />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* User Profile & Orders */}
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                    <Route path="/admin/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                    <Route path="/admin/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
                    <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
                    <Route path="/admin/orders/:id" element={<ProtectedRoute><AdminOrderDetails /></ProtectedRoute>} />
                  </Routes>
                </main>

                <Footer />

                {/* Floating Theme Toggle — visible on ALL pages */}
                <ThemeToggle />
              </div>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </UserAuthProvider>
    </ThemeProvider>
  );
}

export default App;
