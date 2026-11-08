import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useTheme } from '../components/ThemeContext';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerUser } = useUserAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password ar Confirm Password milche na!');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{11,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password e minimum 11 character, 1 ta Capital letter, 1 ta Small letter, 1 ta Number ar 1 ta Special character (@$!%*?&#) thakte hobe!');
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className={`auth-luxe ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      <div className="auth-glow"></div>
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/teen.png" alt="9teenz" className="auth-logo" />
          <h1>Create Account</h1>
          <p>Join the 9teenz family today</p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Full Name</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">👤</span>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="you@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Min 11 chars, A-Z, a-z, 0-9, @$!%*?&#"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔐</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className={`auth-btn ${loading ? 'loading' : ''}`} disabled={loading}>
            <span className="auth-btn-glow"></span>
            <span className="auth-btn-text">
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </span>
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/user-login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
