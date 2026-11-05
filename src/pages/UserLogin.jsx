import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import './Register.css';

function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate('/');
    } catch (err) {
      setError('Login failed! Email/password check koro.');
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>👋 Welcome Back</h2>
        <p>Login koro ar shopping continue koro!</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <p style={{ marginTop: '15px', fontSize: '14px' }}>
          <Link to="/forgot-password" style={{ color: '#e94560', fontWeight: 'bold' }}>
            Forgot Password?
          </Link>
        </p>

        <p className="link-text">
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default UserLogin;