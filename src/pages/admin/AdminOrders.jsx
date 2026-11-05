import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, deleteOrder } from '../../services/orderService';
import './AdminOrders.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchDate, setSearchDate] = useState('');
  const [orderType, setOrderType] = useState('web'); // 🔥 'web' ba 'guest'

  useEffect(() => {
    loadOrders();
  }, [orderType]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders(orderType); // 🔥 Type pass koro
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ei order ta delete korte chao?')) return;
    try {
      await deleteOrder(id);
      setOrders(orders.filter((o) => o._id !== id));
      alert('Order deleted successfully! ✅');
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filtered = orders.filter((o) => {
    const statusMatch = filter === 'All' || o.status === filter;
    let dateMatch = true;
    if (searchDate) {
      const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
      dateMatch = orderDate === searchDate;
    }
    return statusMatch && dateMatch;
  });

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <h1>📦 All Orders</h1>
        <Link to="/admin" className="btn-back">← Back to Admin</Link>
      </div>

      {/* 🔥 Tabs for Web & Social Orders */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button 
          onClick={() => setOrderType('web')} 
          style={{ 
            padding: '10px 20px', 
            borderRadius: '8px', 
            border: 'none', 
            background: orderType === 'web' ? '#1a1a2e' : '#e0e0e0', 
            color: orderType === 'web' ? 'white' : 'black', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}
        >
          🌐 Web Orders (Login User)
        </button>
        <button 
          onClick={() => setOrderType('guest')} 
          style={{ 
            padding: '10px 20px', 
            borderRadius: '8px', 
            border: 'none', 
            background: orderType === 'guest' ? '#e94560' : '#e0e0e0', 
            color: orderType === 'guest' ? 'white' : 'black', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}
        >
          📱 Social Orders (FB/Insta)
        </button>
      </div>

      <div className="filter-bar" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '25px' }}>
        {statuses.map((s) => (
          <button
            key={s}
            className={filter === s ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
          />
          {searchDate && (
            <button
              onClick={() => setSearchDate('')}
              style={{ background: 'transparent', border: 'none', color: '#e94560', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>Kono order pawa jay nai</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {filtered.map((order) => (
            <div key={order._id} className="admin-order-card">
              <div className="order-info">
                <p className="order-id">Order #{order._id.slice(-8)}</p>
                <p className="order-customer">
                  👤 {order.isGuest ? order.guestName : (order.user?.name || 'Unknown')} 
                  ({order.isGuest ? order.guestEmail : (order.user?.email || 'N/A')})
                </p>
                <p className="order-date">
                  📅 {new Date(order.createdAt).toLocaleDateString('en-GB')}
                </p>
                <p className="order-total">💰 ৳ {order.totalPrice}</p>
              </div>

              <span className={`order-status status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>

              {/* 🔥 Action Buttons Container */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link
                  to={`/admin/orders/${order._id}`}
                  state={{ order }}
                  className="btn-view"
                >
                  Edit / View →
                </Link>
                <button
                  onClick={() => handleDelete(order._id)}
                  style={{
                    background: '#ffe5e5',
                    color: '#e94560',
                    border: '1px solid #e94560',
                    padding: '8px 15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;