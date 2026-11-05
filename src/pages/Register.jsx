import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerUser } = useUserAuth();
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

    // 🔥 Frontend Validation
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
    <div className="register-page">
      <div className="register-box">
        <h2>✨ Create Account</h2>
        <p>Register koro ar shopping shuru koro!</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password (Min 11 chars, A-Z, a-z, 0-9, @$!%*?&#)" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="link-text">
          Already have an account? <Link to="/user-login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;