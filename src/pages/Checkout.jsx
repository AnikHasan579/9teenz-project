import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';
import { createOrder } from '../services/orderService';
import './Checkout.css';

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { userAuth } = useUserAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: userAuth?.name || '',
    email: userAuth?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔥 Login force koro
  if (!userAuth) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>Login korte hobe</h2>
          <p>Web theke order korte agey login koro</p>
          <button onClick={() => navigate('/user-login')} className="btn-primary">Login</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>🛒 Cart khali</h2>
          <p>Prothome product add koro</p>
          <button onClick={() => navigate('/products')} className="btn-primary">Products Dekho</button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const items = cart.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || 'N/A',
        image: item.image,
      }));

      const orderData = {
        items,
        shippingAddress: formData,
        totalPrice,
        isGuest: false, // 🔥 Login kora user
      };

      await createOrder(orderData);
      clearCart();
      alert('Order place successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      console.error('Order error:', err);
      setError(err.response?.data?.message || err.message || 'Order failed');
    }
    setLoading(false);
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Address</h2>
          {error && <div className="error-msg">{error}</div>}
          <label>Full Name * <input type="text" name="name" value={formData.name} onChange={handleChange} required /></label>
          <label>Email * <input type="email" name="email" value={formData.email} onChange={handleChange} required /></label>
          <label>Phone * <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX" required /></label>
          <label>Address * <textarea name="address" value={formData.address} onChange={handleChange} rows="3" required /></label>
          <label>City * <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Dhaka" required /></label>
          <label>Postal Code <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="1200" /></label>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cart.map((item) => (
            <div key={`${item._id || item.id}-${item.size}`} className="summary-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p style={{ fontSize: '12px', color: '#888' }}>Size: {item.size || 'N/A'}</p>
                <p>৳ {item.price} × {item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="summary-total"><span>Total</span><span>৳ {totalPrice}</span></div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;