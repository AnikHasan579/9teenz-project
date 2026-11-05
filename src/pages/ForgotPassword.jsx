import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Register.css';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: OTP Pathano
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await API.post('/users/forgot-password', { email });
      setSuccess(res.data.message);
      setStep(2); // OTP Step e jabe
    } catch (err) {
      setError(err.response?.data?.message || 'Email pathাতে problem hoyeche');
    }
    setLoading(false);
  };

  // Step 2: OTP Verify + Password Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    // Password match check
    if (newPassword !== confirmPassword) {
      setError('Notun password ar confirm password milche na!');
      return;
    }

    // Strong password check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{11,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password e minimum 11 character, 1 ta Capital letter, 1 ta Small letter, 1 ta Number ar 1 ta Special character (@$!%*?&#) thakte hobe!');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/users/reset-password', {
        email,
        otp,
        newPassword,
      });
      setSuccess(res.data.message + ' Login page e redirect hocche...');
      setTimeout(() => navigate('/user-login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>🔑 Reset Password</h2>
        <p>{step === 1 ? 'Email dao, OTP pathabo' : 'OTP ar notun password dao'}</p>

        {error && <div className="error-msg">{error}</div>}
        {success && (
          <div style={{ background: '#e5ffe5', color: '#2e8b57', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Apnar Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="6 digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />
            <input
              type="password"
              placeholder="Notun Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength="6"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength="6"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="link-text" style={{ marginTop: '20px' }}>
          Mone pore geche? <Link to="/user-login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;