import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useTheme } from '../components/ThemeContext';
import './UserLogin.css';

function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useUserAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed! Check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className={`auth-luxe ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      <div className="auth-glow"></div>
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/teen.png" alt="9teenz" className="auth-logo" />
          <h1>Welcome Back</h1>
          <p>Login koro ar shopping continue koro!</p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">📧</span>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </span>
          </button>
        </form>

        <div className="auth-footer">
          <p><Link to="/forgot-password">Forgot Password?</Link></p>
          <p>New user? <Link to="/register">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
