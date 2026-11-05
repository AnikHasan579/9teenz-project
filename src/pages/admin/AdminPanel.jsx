import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts, deleteProduct } from '../../services/productService';
import './AdminPanel.css';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ei product delete korte chao?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h1>🛠️ Admin Panel</h1>
          <p>Welcome, {user?.email}</p>
        </div>
        <div className="admin-actions">
          <Link to="/admin/add" className="btn-primary">
            ➕ Add Product
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>Kono product nei. Prothom product add koro!</p>
          <Link to="/admin/add" className="btn-primary">
            ➕ Add Product
          </Link>
        </div>
      ) : (
        <div className="admin-products">
          {products.map((product) => (
            <div key={product._id} className="admin-product-card">
              <img src={product.image} alt={product.name} />
              <div className="admin-product-info">
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">৳ {product.price}</p>
              </div>
              <div className="admin-product-actions">
                <Link
                  to={`/admin/edit/${product._id}`}
                  state={{ product }}
                  className="btn-edit"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="btn-delete"
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

export default AdminPanel;