import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <span className="category-badge">{product.category}</span>
      </div>
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="rating">⭐ {product.rating}</div>
        <div className="price">৳ {product.price}</div>
        
        <div className="action-buttons">
          <Link to={`/product/${product._id || product.id}`} className="view-btn">
            View Details
          </Link>
          <button className="add-btn" onClick={() => addToCart(product)}>
            Add to Cart 🛒
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;