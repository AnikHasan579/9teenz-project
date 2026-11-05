import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import './OrderDetails.css';

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Timeline steps based on order status
  const getTimelineSteps = (status) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: '📝' },
      { key: 'processing', label: 'Processing', icon: '⚙️' },
      { key: 'shipped', label: 'Shipped', icon: '🚚' },
      { key: 'delivered', label: 'Delivered', icon: '✅' },
    ];

    const statusIndex = steps.findIndex(
      (s) => s.key === status?.toLowerCase()
    );

    return steps.map((step, index) => ({
      ...step,
      completed: index <= statusIndex,
      active: index === statusIndex,
    }));
  };

  if (loading) {
    return (
      <div className="loading-luxe">
        <div className="spinner-ring"></div>
        <p>Loading Order...</p>
      </div>
    );
  }

  if (!order) return null;

  const statusClass = `status-${order.status?.toLowerCase() || 'pending'}`;
  const timelineSteps = getTimelineSteps(order.status);
  const progressPercent = ((timelineSteps.filter((s) => s.completed).length - 1) / (timelineSteps.length - 1)) * 100;

  return (
    <div className="order-luxe">
      {/* Back Navigation */}
      <div className="back-nav">
        <Link to="/orders" className="back-btn">
          <span className="arrow">←</span> Back to Orders
        </Link>
      </div>

      {/* Order Hero Header */}
      <div className="order-hero">
        <div className="order-hero-top">
          <div>
            <h1>
              Order <em>#{order._id?.slice(-8).toUpperCase()}</em>
            </h1>
            <div className="order-id-row">
              <span className="order-id-label">Order ID</span>
              <span className="order-id-value">{order._id}</span>
            </div>
            <div className="order-date-row">
              <span>📅 {new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}</span>
              <span className="dot"></span>
              <span>🕐 {new Date(order.createdAt).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}</span>
              <span className="dot"></span>
              <span>{order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}</span>
            </div>
          </div>
          <span className={`status-badge ${statusClass}`}>
            <span className="status-dot"></span>
            {order.status}
          </span>
        </div>

        {/* Order Timeline */}
        <div className="timeline-wrap">
          <div className="timeline">
            <div
              className="timeline-progress"
              style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
            ></div>
            {timelineSteps.map((step, index) => (
              <div
                key={step.key}
                className={`timeline-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}
              >
                <div className="step-circle">{step.icon}</div>
                <span className="step-label">{step.label}</span>
                {step.completed && (
                  <span className="step-date">
                    {index === 0
                      ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                      : '—'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="order-main">
        {/* Left: Items */}
        <div className="order-card">
          <div className="card-header">
            <h2>
              <span className="icon">📦</span> Order Items
            </h2>
            <span className="item-count">{order.items?.length || 0} items</span>
          </div>
          <div className="card-body">
            {order.items?.map((item, i) => (
              <div key={i} className="item-luxe">
                <div className="item-img-wrap">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <div className="item-meta-row">
                    <span className="price-each">৳ {item.price} each</span>
                    <span className="qty-badge">Qty: {item.quantity}</span>
                    {item.category && (
                      <span className="category-tag">{item.category}</span>
                    )}
                  </div>
                </div>
                <div className="item-total">
                  <div className="price">৳ {item.price * item.quantity}</div>
                  <div className="calc">{item.quantity} × ৳{item.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="sidebar">
          {/* Shipping Address */}
          <div className="sidebar-card">
            <div className="card-header">
              <h2>
                <span className="icon">🚚</span> Shipping Details
              </h2>
            </div>
            <div className="card-body">
              <div className="address-content">
                <p className="name">{order.shippingAddress?.name}</p>
                <p className="phone">📱 {order.shippingAddress?.phone}</p>
                <p className="line">{order.shippingAddress?.address}</p>
                <p className="line city">
                  {order.shippingAddress?.city}
                  {order.shippingAddress?.postalCode && ` — ${order.shippingAddress.postalCode}`}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="sidebar-card">
            <div className="card-header">
              <h2>
                <span className="icon">💰</span> Payment Summary
              </h2>
            </div>
            <div className="card-body">
              <div className="payment-rows">
                <div className="pay-row">
                  <span className="label">Subtotal</span>
                  <span className="value">৳ {order.totalPrice}</span>
                </div>
                <div className="pay-row shipping">
                  <span className="label">Shipping</span>
                  <span className="value">Free</span>
                </div>
                <div className="pay-row discount">
                  <span className="label">Discount</span>
                  <span className="value">—</span>
                </div>
                <div className="pay-row total">
                  <span className="label">Total Amount</span>
                  <span className="value">৳ {order.totalPrice}</span>
                </div>
              </div>
              <div className="pay-method">
                <span className="method-icon">💵</span>
                <div className="method-info">
                  <span className="method-label">Payment Method</span>
                  <span className="method-name">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="summary-bar">
        <div className="summary-bar-inner">
          <p>
            <strong>Order placed on</strong>{' '}
            {new Date(order.createdAt).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <div className="summary-total">
            <div className="label">Grand Total</div>
            <div className="amount">৳ {order.totalPrice}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
