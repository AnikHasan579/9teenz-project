import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useTheme } from '../components/ThemeContext';
import { getMyOrders } from '../services/orderService';
import './Orders.css';

function Orders() {
  const { userAuth } = useUserAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userAuth) {
      navigate('/user-login');
      return;
    }
    loadOrders();
  }, [userAuth]);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  if (!userAuth) return null;

  return (
    <div className={`orders-luxe ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      <div className="orders-ambient"></div>

      <section className="orders-hero">
        <h1>My <em>Orders</em></h1>
        <p>
          {orders.length > 0 ? (
            <>
              You have <span className="count">{orders.length}</span>{' '}
              {orders.length === 1 ? 'order' : 'orders'} in your history
            </>
          ) : (
            'Track and manage all your orders in one place'
          )}
        </p>
      </section>

      {error && (
        <div className="orders-error">
          <div className="error-box">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="orders-loading">
          <div className="orders-spinner">
            <div className="spinner-core"></div>
            <div className="spinner-orbit"></div>
          </div>
          <p>Loading Orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-card">
            <div className="empty-icon">📦</div>
            <h2>No Orders Yet</h2>
            <p>Your order history will appear here once you make your first purchase.</p>
            <Link to="/products" className="btn-gold">Start Shopping</Link>
          </div>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-meta">
                  <span className="meta-label">Order</span>
                  <span className="meta-id">#{order._id?.slice(-8).toUpperCase()}</span>
                  <span className="meta-date">
                    📅 {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}>
                  <span className="status-pip"></span>
                  {order.status}
                </span>
              </div>

              <div className="order-items-row">
                <div className="item-stack">
                  {order.items?.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name}
                      className="stack-img"
                      loading="lazy"
                    />
                  ))}
                  {order.items?.length > 4 && (
                    <div className="stack-more">+{order.items.length - 4}</div>
                  )}
                </div>
                <span className="item-names">
                  {order.items?.slice(0, 2).map((item) => item.name).join(', ')}
                  {order.items?.length > 2 && ' & more'}
                </span>
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span className="total-label">Total</span>
                  <span className="total-amount">৳ {order.totalPrice}</span>
                </div>
                <Link to={`/orders/${order._id}`} className="btn-details">
                  View Details <span className="arrow">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
