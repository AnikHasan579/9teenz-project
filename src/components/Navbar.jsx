import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useUserAuth } from '../context/UserAuthContext';
import { useTheme } from '../components/ThemeContext';
import './Navbar.css';

function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { userAuth, logoutUser } = useUserAuth();
  const { darkMode } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <nav className={`navbar-luxe ${scrolled ? 'scrolled' : ''} ${darkMode ? 'theme-dark' : 'theme-light'}`}>
        <Link to="/" className="nav-logo">
          <img src="/teen.png" alt="9teenz" className="nav-logo-img" />
        </Link>

        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              <span className="nav-emoji">🏠</span>
              <span className="nav-label">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/products" className={isActive('/products') ? 'active' : ''}>
              <span className="nav-emoji">🛍️</span>
              <span className="nav-label">Shop</span>
            </Link>
          </li>
          <li className="cart-li">
            <Link to="/cart" className={isActive('/cart') ? 'active' : ''}>
              <span className="nav-emoji">🛒</span>
              <span className="nav-label">Cart</span>
              {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
            </Link>
          </li>

          {(user || userAuth) && (
            <li>
              <Link to="/tryon" className={isActive('/tryon') ? 'active' : ''}>
                <span className="nav-emoji">🥽</span>
                <span className="nav-label">Try-On</span>
              </Link>
            </li>
          )}

          <div className="nav-divider"></div>

          {user ? (
            <>
              <li>
                <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
                  <span className="nav-emoji">⚙️</span>
                  <span className="nav-label">Admin</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className={isActive('/admin/orders') ? 'active' : ''}>
                  <span className="nav-emoji">📋</span>
                  <span className="nav-label">Orders</span>
                </Link>
              </li>
              <li>
                <button onClick={logout} className="nav-btn nav-btn-logout">Logout</button>
              </li>
            </>
          ) : userAuth ? (
            <>
              <li>
                <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>
                  <span className="nav-emoji">📦</span>
                  <span className="nav-label">Orders</span>
                </Link>
              </li>
              <li className="user-li">
                <div className="nav-user">
                  <span className="nav-avatar">{getInitials(userAuth.name)}</span>
                  <span className="nav-username">{userAuth.name}</span>
                </div>
              </li>
              <li>
                <button onClick={logoutUser} className="nav-btn nav-btn-logout">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                  <span className="nav-emoji">🔐</span>
                  <span className="nav-label">Admin</span>
                </Link>
              </li>
              <li>
                <Link to="/user-login" className="nav-btn nav-btn-primary">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="nav-btn nav-btn-ghost">Join</Link>
              </li>
            </>
          )}
        </ul>

        <button
          className={`hamburger ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`nav-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)}></div>
    </>
  );
}

export default Navbar;
