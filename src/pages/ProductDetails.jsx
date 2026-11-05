import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useTheme } from '../components/ThemeContext';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { darkMode } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [activeTab, setActiveTab] = useState('image');
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => { loadProduct(); }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
      setMainImage(data.image);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('Please select a size first!');
      return;
    }
    const sizeData = product.sizes.find((s) => s.size === selectedSize);
    if (sizeData.stock <= 0) {
      setSizeError('Out of stock!');
      return;
    }
    setSizeError('');
    const productWithSize = { ...product, size: selectedSize };
    addToCart(productWithSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className={`product-luxe ${darkMode ? 'theme-dark' : 'theme-light'}`}>
        <div className="pd-loading">
          <div className="pd-spinner-ring">
            <div className="pd-spinner-core"></div>
            <div className="pd-spinner-orbit"></div>
          </div>
          <p>Loading Experience...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`product-luxe ${darkMode ? 'theme-dark' : 'theme-light'}`}>
        <div className="pd-notfound">
          <div className="pd-notfound-icon">📦</div>
          <h2>Product Not Found</h2>
          <p>The masterpiece you are looking for does not exist.</p>
          <Link to="/products" className="pd-btn-back">Explore Collection</Link>
        </div>
      </div>
    );
  }

  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? [product.image, ...product.gallery]
      : [product.image];

  const selectedSizeData = product.sizes?.find((s) => s.size === selectedSize);
  const isOutOfStock = selectedSizeData ? selectedSizeData.stock <= 0 : true;

  return (
    <div className={`product-luxe ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      {/* Ambient background glow */}
      <div className="pd-ambient-glow"></div>

      {/* Breadcrumb */}
      <nav className="pd-breadcrumb">
        <Link to="/">Home</Link>
        <span className="pd-breadcrumb-dot"></span>
        <Link to="/products">Collection</Link>
        <span className="pd-breadcrumb-dot"></span>
        <span className="pd-breadcrumb-current">{product.name}</span>
      </nav>

      <div className="pd-container">
        {/* LEFT: 3D Gallery */}
        <div className="pd-gallery-col">
          <div
            className="pd-stage"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="pd-stage-inner"
              style={{
                transform: `perspective(1200px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
              }}
            >
              <div className="pd-image-frame">
                <div className="pd-image-glow"></div>
                {activeTab === 'image' ? (
                  <img src={mainImage} alt={product.name} />
                ) : (
                  <iframe src={product.video} title="Product Video" allowFullScreen></iframe>
                )}
              </div>
            </div>
            {/* Floating particles */}
            <div className="pd-particle p1"></div>
            <div className="pd-particle p2"></div>
            <div className="pd-particle p3"></div>
          </div>

          {/* Tabs */}
          <div className="pd-tabs">
            <button
              className={activeTab === 'image' ? 'pd-tab active' : 'pd-tab'}
              onClick={() => setActiveTab('image')}
            >
              <span className="pd-tab-icon">📷</span> Gallery
            </button>
            {product.video && (
              <button
                className={activeTab === 'video' ? 'pd-tab active' : 'pd-tab'}
                onClick={() => setActiveTab('video')}
              >
                <span className="pd-tab-icon">▶️</span> Video
              </button>
            )}
          </div>

          {/* Thumbnails */}
          {activeTab === 'image' && (
            <div className="pd-thumbs">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  className={mainImage === img ? 'pd-thumb active' : 'pd-thumb'}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`View ${index}`} loading="lazy" />
                  {mainImage === img && <div className="pd-thumb-glow"></div>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Details */}
        <div className="pd-details-col">
          {/* Category */}
          <div className="pd-category">
            <span className="pd-category-line"></span>
            <span>{product.category || 'Exclusive Collection'}</span>
          </div>

          {/* Title */}
          <h1 className="pd-title">{product.name}</h1>

          {/* Rating row */}
          <div className="pd-meta-row">
            <div className="pd-rating">
              <span className="pd-stars">★★★★★</span>
              <span className="pd-rating-score">{product.rating || '4.9'}</span>
              <span className="pd-rating-count">(128 verified reviews)</span>
            </div>
            <div className="pd-stock-status">
              <span className="pd-pulse-dot"></span>
              In Stock — Ships within 24h
            </div>
          </div>

          {/* Price */}
          <div className="pd-price-block">
            <span className="pd-price">
              <span className="pd-currency">৳</span>
              {product.price}
              <span className="pd-price-dec">.00</span>
            </span>
            <span className="pd-price-tag">BDT</span>
            {product.oldPrice && (
              <span className="pd-old-price">৳{product.oldPrice}</span>
            )}
          </div>

          {/* Divider */}
          <div className="pd-divider">
            <div className="pd-divider-glow"></div>
          </div>

          {/* Description */}
          <div className="pd-desc">
            <p>{product.description || 'Crafted with precision and passion. This piece embodies the perfect fusion of contemporary design and timeless elegance. Every stitch, every detail is designed to make you stand out.'}</p>
          </div>

          {/* Features */}
          <div className="pd-features">
            <div className="pd-feature">
              <span className="pd-feat-icon">✦</span>
              <span>Premium Fabric</span>
            </div>
            <div className="pd-feature">
              <span className="pd-feat-icon">✦</span>
              <span>Handcrafted</span>
            </div>
            <div className="pd-feature">
              <span className="pd-feat-icon">✦</span>
              <span>Limited Edition</span>
            </div>
            <div className="pd-feature">
              <span className="pd-feat-icon">✦</span>
              <span>Easy Returns</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="pd-size-section">
            <div className="pd-size-header">
              <h3>Select Size</h3>
              {selectedSize && (
                <span className={`pd-stock-badge ${isOutOfStock ? 'out' : 'in'}`}>
                  <span className="pd-stock-pip"></span>
                  {isOutOfStock ? 'Out of Stock' : `${selectedSizeData?.stock} available`}
                </span>
              )}
            </div>
            <div className="pd-size-grid">
              {product.sizes && product.sizes.length > 0 ? (
                product.sizes.map((sizeData, index) => (
                  <button
                    key={index}
                    className={selectedSize === sizeData.size ? 'pd-size-btn active' : 'pd-size-btn'}
                    onClick={() => { setSelectedSize(sizeData.size); setSizeError(''); }}
                    disabled={sizeData.stock <= 0}
                  >
                    {sizeData.size}
                    {sizeData.stock <= 3 && sizeData.stock > 0 && (
                      <span className="pd-low-stock">{sizeData.stock}</span>
                    )}
                  </button>
                ))
              ) : (
                <p className="pd-no-sizes">No sizes available</p>
              )}
            </div>
            {sizeError && (
              <div className="pd-size-error"><span>⚠</span>{sizeError}</div>
            )}
          </div>

          {/* Actions */}
          <div className="pd-actions">
            <button
              className={`pd-add-btn ${isAdded ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock || !selectedSize}
            >
              <span className="pd-btn-glow"></span>
              <span className="pd-btn-text">
                {isAdded ? '✓ Added to Cart' : isOutOfStock || !selectedSize ? 'Select a Size' : 'Add to Cart'}
              </span>
              <span className="pd-btn-shine"></span>
            </button>

            <div className="pd-trust-row">
              <div className="pd-trust-item">
                <span className="pd-trust-icon">🚚</span>
                <div>
                  <strong>Free Delivery</strong>
                  <span>On orders over ৳2000</span>
                </div>
              </div>
              <div className="pd-trust-item">
                <span className="pd-trust-icon">🛡️</span>
                <div>
                  <strong>Secure Payment</strong>
                  <span>100% encrypted checkout</span>
                </div>
              </div>
              <div className="pd-trust-item">
                <span className="pd-trust-icon">↩️</span>
                <div>
                  <strong>Easy Returns</strong>
                  <span>7-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
