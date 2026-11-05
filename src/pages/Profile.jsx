import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import API from '../services/api';
import './Profile.css';

function Profile() {
  const { userAuth, logoutUser } = useUserAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userAuth) {
      navigate('/user-login');
      return;
    }
    loadProfile();
  }, [userAuth]);

  const loadProfile = async () => {
    try {
      const res = await API.get('/users/profile');
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        password: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await API.put('/users/profile', formData);
      setMessage('Profile updated successfully! ✅');
    } catch (err) {
      setMessage('Update failed: ' + err.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!userAuth) return null;

  return (
    <div className="profile-page">
      <div className="profile-box">
        <h1>👤 My Profile</h1>
        <p>Apnar information update koro</p>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>

          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>

          <label>
            Phone
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX" />
          </label>

          <label>
            Address
            <textarea name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="Apnar full address" />
          </label>

          <label>
            New Password (optional)
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Khali rakho jodi change na korte chao" />
          </label>

          <div className="form-actions">
            <button type="button" onClick={handleLogout} className="btn-logout">Logout</button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;