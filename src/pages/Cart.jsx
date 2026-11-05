import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { userAuth } = useUserAuth();

  // 🔥 Web Checkout (Login force korbe)
  const handleWebCheckout = () => {
    if (!userAuth) {
      alert('Web theke order korte agey login korte hobe!');
      navigate('/user-login');
    } else {
      navigate('/checkout');
    }
  };

  // 🔥 Social Checkout (Login lagbe na)
  const handleGuestCheckout = () => {
    navigate('/guest-order');
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>🛒 Tomar cart khali</h2>
        <p>Kichu product add koro!</p>
        <Link to="/products" className="shop-btn">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => {
            const sizeData = item.sizes?.find((s) => s.size === item.size);
            const maxStock = sizeData ? sizeData.stock : 0;
            const isMaxStock = item.quantity >= maxStock;

            return (
              <div key={`${item._id || item.id}-${item.size}`} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category} | Size: <strong>{item.size}</strong></p>
                  <p className="item-price">৳ {item.price}</p>
                  <p style={{ fontSize: '12px', color: isMaxStock ? '#e94560' : '#888' }}>
                    {isMaxStock ? `⚠️ Max stock reached (${maxStock})` : `Available Stock: ${maxStock}`}
                  </p>
                </div>
                <div className="quantity-control">
                  <button onClick={() => decreaseQty(item._id || item.id, item.size)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item._id || item.id, item.size)} disabled={isMaxStock}>+</button>
                </div>
                <div className="item-total">৳ {item.price * item.quantity}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item._id || item.id, item.size)}>✕</button>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row"><span>Subtotal</span><span>৳ {totalPrice}</span></div>
          <div className="summary-row"><span>Shipping</span><span>Free</span></div>
          <div className="summary-row total"><span>Total</span><span>৳ {totalPrice}</span></div>
          
          {/* 🔥 Web Checkout Button */}
          <button className="checkout-btn" onClick={handleWebCheckout}>
            Login & Checkout (Web)
          </button>

          {/* 🔥 Social Checkout Button */}
          <button 
            onClick={handleGuestCheckout} 
            style={{ width: '100%', padding: '14px', marginTop: '10px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Order via Social Media
          </button>

          <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;