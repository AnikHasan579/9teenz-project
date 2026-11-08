import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import { getOrderById } from '../services/orderService';
import './OrderDetails.css';

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error(err);
      navigate('/orders');
    }
    setLoading(false);
  };

  const getTimelineSteps = (status) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: '📝' },
      { key: 'processing', label: 'Processing', icon: '⚙️' },
      { key: 'shipped', label: 'Shipped', icon: '🚚' },
      { key: 'delivered', label: 'Delivered', icon: '✅' },
    ];
    const statusIndex = steps.findIndex((s) => s.key === status?.toLowerCase());
    return steps.map((step, index) => ({
      ...step,
      completed: index <= statusIndex,
      active: index === statusIndex,
    }));
  };

  if (loading) {
    return (
      <div className={`order-luxe ${darkMode ? 'theme-dark' : 'theme-light'}`}>
        <div className="od-loading">
          <div className="od-spinner">
            <div className="od-spinner-core"></div>
            <div className="od-spinner-orbit"></div>
          </div>
          <p>Loading Order...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusClass = `status-${order.status?.toLowerCase() || 'pending'}`;
  const timelineSteps = getTimelineSteps(order.status);
  const progressPercent = ((timelineSteps.filter((s) => s.completed).length - 1) / (timelineSteps.length - 1)) * 100;

  return (
    <div className={`order-luxe ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      <div className="od-ambient"></div>

      <div className="od-back">
        <Link to="/orders" className="od-back-btn">
          <span>←</span> Back to Orders
        </Link>
      </div>

      <div className="od-hero">
        <div className="od-hero-top">
          <div>
            <h1>Order <em>#{order._id?.slice(-8).toUpperCase()}</em></h1>
            <div className="od-id-row">
              <span className="od-id-label">Order ID</span>
              <span className="od-id-value">{order._id}</span>
            </div>
            <div className="od-date-row">
              <span>📅 {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="od-dot"></span>
              <span>🕐 {new Date(order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="od-dot"></span>
              <span>{order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}</span>
            </div>
          </div>
          <span className={`od-status-badge ${statusClass}`}>
            <span className="od-status-pip"></span>
            {order.status}
          </span>
        </div>

        <div className="od-timeline-wrap">
          <div className="od-timeline">
            <div className="od-timeline-track">
              <div className="od-timeline-fill" style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}></div>
            </div>
            {timelineSteps.map((step) => (
              <div key={step.key} className={`od-t-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                <div className="od-step-ring">
                  <div className="od-step-circle">{step.icon}</div>
                </div>
                <span className="od-step-label">{step.label}</span>
                {step.completed && (
                  <span className="od-step-date">
                    {step.key === 'pending' ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="od-main">
        <div className="od-left">
          <div className="od-card">
            <div className="od-card-header">
              <h2><span className="od-hicon">📦</span> Order Items</h2>
              <span className="od-item-count">{order.items?.length || 0} items</span>
            </div>
            <div className="od-card-body">
              {order.items?.map((item, i) => (
                <div key={i} className="od-item">
                  <div className="od-item-img-wrap">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <div className="od-item-img-glow"></div>
                  </div>
                  <div className="od-item-info">
                    <h4>{item.name}</h4>
                    <div className="od-item-meta">
                      <span className="od-each">৳ {item.price} each</span>
                      <span className="od-qty">Qty: {item.quantity}</span>
                      {item.category && <span className="od-cat">{item.category}</span>}
                    </div>
                  </div>
                  <div className="od-item-price">
                    <div className="od-price-main">৳ {item.price * item.quantity}</div>
                    <div className="od-price-calc">{item.quantity} × ৳{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="od-right">
          <div className="od-card">
            <div className="od-card-header">
              <h2><span className="od-hicon">🚚</span> Shipping Details</h2>
            </div>
            <div className="od-card-body">
              <div className="od-address">
                <p className="od-addr-name">{order.shippingAddress?.name}</p>
                <p className="od-addr-phone">📱 {order.shippingAddress?.phone}</p>
                <p className="od-addr-line">{order.shippingAddress?.address}</p>
                <p className="od-addr-city">
                  {order.shippingAddress?.city}
                  {order.shippingAddress?.postalCode && ` — ${order.shippingAddress.postalCode}`}
                </p>
              </div>
            </div>
          </div>

          <div className="od-card">
            <div className="od-card-header">
              <h2><span className="od-hicon">💰</span> Payment Summary</h2>
            </div>
            <div className="od-card-body">
              <div className="od-pay-rows">
                <div className="od-pay-row">
                  <span>Subtotal</span>
                  <span>৳ {order.totalPrice}</span>
                </div>
                <div className="od-pay-row od-free">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="od-pay-row">
                  <span>Discount</span>
                  <span>—</span>
                </div>
                <div className="od-pay-row od-total">
                  <span>Total Amount</span>
                  <span>৳ {order.totalPrice}</span>
                </div>
              </div>
              <div className="od-pay-method">
                <span className="od-pay-icon">💵</span>
                <div>
                  <span className="od-pay-label">Payment Method</span>
                  <span className="od-pay-name">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="od-summary-bar">
        <div className="od-summary-inner">
          <p>
            <strong>Order placed on</strong>{' '}
            {new Date(order.createdAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div className="od-grand-total">
            <span className="od-grand-label">Grand Total</span>
            <span className="od-grand-amount">৳ {order.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
