import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus, updateOrderAddress } from '../../services/orderService';
import './AdminOrderDetails.css';

function AdminOrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [updating, setUpdating] = useState(false);
  
  // 🔥 Edit Address State
  const [isEditing, setIsEditing] = useState(false);
  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    if (!order) {
      loadOrder();
    } else {
      setAddressData(order.shippingAddress);
    }
  }, [id, order]);

  const loadOrder = async () => {
    try {
      const orders = await getAllOrders();
      const found = orders.find((o) => o._id === id);
      if (found) {
        setOrder(found);
        setAddressData(found.shippingAddress);
      } else {
        navigate('/admin/orders');
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleStatusChange = async (newStatus) => {
    if (order.status === newStatus) return;
    setUpdating(true);
    try {
      const updated = await updateOrderStatus(id, newStatus);
      setOrder({ ...order, status: updated.status });
      alert('Status updated! ✅');
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
    setUpdating(false);
  };

  // 🔥 Address Update Function
  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updated = await updateOrderAddress(id, addressData);
      setOrder({ ...order, shippingAddress: updated.shippingAddress });
      setIsEditing(false);
      alert('Address updated successfully! ✅');
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
    setUpdating(false);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!order) return null;

  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="admin-order-details-page">
      <Link to="/admin/orders" className="back-link">← Back to Orders</Link>

      <div className="admin-order-details-card">
        <div className="order-header">
          <div>
            <h1>Order #{order._id.slice(-8)}</h1>
            <p className="order-date">
              📅 {new Date(order.createdAt).toLocaleString('en-GB')}
            </p>
          </div>
          <span className={`order-status status-${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>

        <div className="section">
          <h2>👤 Customer Info</h2>
          <div className="info-box">
            <p><strong>Name:</strong> {order.user?.name || 'Unknown'}</p>
            <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
          </div>
        </div>

        <div className="section">
          <h2>🚚 Shipping Address</h2>
          
          {isEditing ? (
            <form onSubmit={handleAddressUpdate} className="edit-address-form">
              <input 
                type="text" 
                placeholder="Name" 
                value={addressData.name} 
                onChange={(e) => setAddressData({...addressData, name: e.target.value})} 
                required 
              />
              <input 
                type="text" 
                placeholder="Phone" 
                value={addressData.phone} 
                onChange={(e) => setAddressData({...addressData, phone: e.target.value})} 
                required 
              />
              <textarea 
                placeholder="Address" 
                value={addressData.address} 
                onChange={(e) => setAddressData({...addressData, address: e.target.value})} 
                required 
              />
              <input 
                type="text" 
                placeholder="City" 
                value={addressData.city} 
                onChange={(e) => setAddressData({...addressData, city: e.target.value})} 
                required 
              />
              <input 
                type="text" 
                placeholder="Postal Code" 
                value={addressData.postalCode} 
                onChange={(e) => setAddressData({...addressData, postalCode: e.target.value})} 
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" disabled={updating} className="btn-save">Save Address</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="info-box">
              <p><strong>Name:</strong> {order.shippingAddress.name}</p>
              <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
              <p><strong>Address:</strong> {order.shippingAddress.address}</p>
              <p><strong>City:</strong> {order.shippingAddress.city}</p>
              <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode || 'N/A'}</p>
              
              <button 
                onClick={() => setIsEditing(true)} 
                style={{ 
                  marginTop: '15px', 
                  background: '#1a1a2e', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold' 
                }}
              >
                ✏️ Edit Address
              </button>
            </div>
          )}
        </div>

        <div className="section">
          <h2>📦 Order Items</h2>
          <div className="items-list">
            {order.items.map((item, i) => (
              <div key={i} className="item-row">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p style={{ fontSize: '13px', color: '#888' }}>
                    Size: <strong style={{ color: '#e94560' }}>{item.size || 'N/A'}</strong>
                  </p>
                  <p>৳ {item.price} × {item.quantity}</p>
                </div>
                <p className="item-subtotal">৳ {item.price * item.quantity}</p>
              </div>
            ))}
            <div className="total-row">
              <span>Total</span>
              <span>৳ {order.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>⚙️ Update Order Status</h2>
          <div className="status-buttons">
            {statuses.map((s) => (
              <button
                key={s}
                className={order.status === s ? 'status-btn active' : 'status-btn'}
                onClick={() => handleStatusChange(s)}
                disabled={updating || order.status === s}
              >
                {updating ? 'Updating...' : s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetails;