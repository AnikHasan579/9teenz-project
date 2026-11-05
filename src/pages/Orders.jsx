import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { getMyOrders } from '../services/orderService';
import './Orders.css';

function Orders() {
  const { userAuth } = useUserAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Orders Page - UserAuth:', userAuth);

    if (!userAuth) {
      navigate('/user-login');
      return;
    }
    loadOrders();
  }, [userAuth]);

  const loadOrders = async () => {
    try {
      console.log('Loading orders...');
      const data = await getMyOrders();
      console.log('Orders received:', data);
      setOrders(data);
    } catch (err) {
      console.error('Load error:', err);
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  if (!userAuth) return null;

  return (
    <div className="orders-luxe">

      {/* Hero Header */}
      <section className="orders-hero">
        <h1>
          My <em>Orders</em>
        </h1>
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

      {/* Error */}
      {error && (
        <div className="error-luxe">
          <div className="error-box">
            <span className="icon">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="loading-luxe">
          <div className="spinner-ring"></div>
          <p>Loading Orders...</p>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="empty-luxe">
          <div className="empty-card">
            <div className="empty-icon">📦</div>
            <h2>No Orders Yet</h2>
            <p>Your order history will appear here once you make your first purchase.</p>
            <Link to="/products" className="btn-gold">Start Shopping</Link>
          </div>
        </div>
      ) : (
        /* Orders Grid */
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-row">

              {/* Card Header */}
              <div className="order-row-header">
                <div className="order-id-group">
                  <span className="id-label">Order</span>
                  <span className="id-value">#{order._id?.slice(-8).toUpperCase()}</span>
                  <span className="date">
                    📅 {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className={`status-pill ${order.status?.toLowerCase() || 'pending'}`}>
                  <span className="status-dot-sm"></span>
                  {order.status}
                </span>
              </div>

              {/* Items Preview */}
              <div className="order-items-preview">
                <div className="item-avatars">
                  {order.items?.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name}
                      className="item-avatar"
                      loading="lazy"
                    />
                  ))}
                  {order.items?.length > 4 && (
                    <div className="more-badge">+{order.items.length - 4}</div>
                  )}
                </div>
                <span className="item-names">
                  {order.items?.slice(0, 2).map((item) => item.name).join(', ')}
                  {order.items?.length > 2 && ' & more'}
                </span>
              </div>

              {/* Card Footer */}
              <div className="order-row-footer">
                <div className="total-group">
                  <span className="label">Total</span>
                  <span className="amount">৳ {order.totalPrice}</span>
                </div>
                <Link to={`/orders/${order._id}`} className="btn-view-details">
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
