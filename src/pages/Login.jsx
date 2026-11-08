import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../components/ThemeContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
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
          <h1>Admin Access</h1>
          <p>Sign in to manage your 9teenz dashboard</p>
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
                placeholder="admin@9teenz.com"
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
          <p className="auth-hint">Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
}

export default Login;