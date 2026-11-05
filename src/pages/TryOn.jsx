import { useState, useEffect, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html, Center } from '@react-three/drei';
import { useUserAuth } from '../context/UserAuthContext';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/productService';
import './TryOn.css';

// 3D Model Component
function ProductModel({ url }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} scale={1.5} />
    </Center>
  );
}

// Loading fallback for 3D canvas
function CanvasLoader() {
  return (
    <Html center>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '2px solid rgba(212, 175, 55, 0.1)',
          borderTopColor: '#d4af37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: '#666', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Loading 3D...
        </p>
      </div>
    </Html>
  );
}

function TryOn() {
  const { userAuth } = useUserAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('rotate'); // rotate, zoom
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      try {
        const data = await getProducts();
        if (!active) return;
        const list = Array.isArray(data) ? data : data?.products || [];
        setProducts(list);
        if (list.length > 0) {
          setSelectedProduct(list[0]);
          if (list[0].sizes?.length > 0) {
            setSelectedSize(list[0].sizes[0].size);
          }
        }
      } catch (err) {
        console.error('Failed to load products:', err);
        if (active) setError('Failed to load products.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProducts();
    return () => { active = false; };
  }, []);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    if (product.sizes?.length > 0) {
      const availableSize = product.sizes.find((s) => s.stock > 0);
      setSelectedSize(availableSize ? availableSize.size : product.sizes[0].size);
    } else {
      setSelectedSize('');
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedSize) return;
    const productWithSize = { ...selectedProduct, size: selectedSize };
    addToCart(productWithSize);
    alert('Added to cart! ✅');
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const modelUrl = selectedProduct?.model3D || selectedProduct?.modelUrl;

  // Login required state
  if (!userAuth) {
    return (
      <div className="login-prompt">
        <div className="login-card">
          <div className="icon">👤</div>
          <h2>Login to Try On</h2>
          <p>Experience our 3D virtual try-on feature. Rotate, zoom, and explore products in 360° before you buy.</p>
          <button className="btn-login-gold" onClick={() => navigate('/user-login')}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="loading-tryon">
        <div className="spinner"></div>
        <p>Loading 3D Experience...</p>
      </div>
    );
  }

  return (
    <div className="tryon-luxe">
      {/* Header */}
      <header className="tryon-header">
        <h1>
          <span className="icon">🥽</span>
          Virtual <em>Try-On</em>
        </h1>
        <div className="header-actions">
          <button
            className={`btn-icon ${viewMode === 'rotate' ? 'active' : ''}`}
            onClick={() => setViewMode('rotate')}
            title="Rotate Mode"
          >
            🔄
          </button>
          <button
            className={`btn-icon ${viewMode === 'zoom' ? 'active' : ''}`}
            onClick={() => setViewMode('zoom')}
            title="Zoom Mode"
          >
            🔍
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="tryon-main">
        {/* Viewer Area */}
        <div className="viewer-area">
          <div className="viewer-canvas">
            <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
              <color attach="background" args={['#0f0f0f']} />
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
              <directionalLight position={[-3, 2, -3]} intensity={0.4} />
              <Environment preset="city" />

              <Suspense fallback={<CanvasLoader />}>
                {modelUrl ? (
                  <ProductModel url={modelUrl} />
                ) : (
                  <Html center>
                    <div className="no-model-overlay">
                      <div className="no-model-card">
                        <div className="icon">📦</div>
                        <h3>3D Model Unavailable</h3>
                        <p>This product does not have a 3D model yet. Browse other products or view the 2D gallery.</p>
                        <Link to={`/product/${selectedProduct?._id}`} className="btn-login-gold" style={{ marginTop: '8px', display: 'inline-flex' }}>
                          View Product
                        </Link>
                      </div>
                    </div>
                  </Html>
                )}
              </Suspense>

              <ContactShadows
                position={[0, -1.5, 0]}
                opacity={0.3}
                scale={10}
                blur={2}
                far={4}
                color="#000"
              />
              <OrbitControls
                enablePan={false}
                minDistance={2}
                maxDistance={8}
                target={[0, 0, 0]}
                autoRotate={viewMode === 'rotate'}
                autoRotateSpeed={3}
                enableZoom={true}
              />
            </Canvas>
          </div>

          {/* Viewer Info Overlay */}
          {selectedProduct && (
            <div className="viewer-info">
              <p className="category">{selectedProduct.category || 'Collection'}</p>
              <h2>{selectedProduct.name}</h2>
              <p className="price">
                ৳ {selectedProduct.price}
                <span> BDT</span>
              </p>
              {selectedSize && (
                <button className="btn-add-from-viewer" onClick={handleAddToCart}>
                  Add to Cart — Size {selectedSize}
                </button>
              )}
            </div>
          )}

          {/* Viewer Controls */}
          <div className="viewer-controls">
            <button
              className={`vctrl-btn ${viewMode === 'rotate' ? 'active' : ''}`}
              onClick={() => setViewMode('rotate')}
            >
              🔄 Rotate
            </button>
            <button
              className={`vctrl-btn ${viewMode === 'zoom' ? 'active' : ''}`}
              onClick={() => setViewMode('zoom')}
            >
              🔍 Zoom
            </button>
            <button
              className="vctrl-btn"
              onClick={() => setViewMode('reset')}
            >
              ⌖ Reset
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="tryon-sidebar">
          <div className="sidebar-header">
            <h2>3D Collection</h2>
            <p>{filteredProducts.length} products available</p>
          </div>

          {/* Search */}
          <div className="sidebar-search">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Product List */}
          <div className="sidebar-products">
            {error ? (
              <p style={{ color: '#ef4444', padding: '20px', textAlign: 'center' }}>{error}</p>
            ) : filteredProducts.length === 0 ? (
              <p style={{ color: '#555', padding: '20px', textAlign: 'center' }}>No products found</p>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className={`product-tile ${selectedProduct?._id === product._id ? 'active' : ''}`}
                  onClick={() => handleProductSelect(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="tile-img"
                    loading="lazy"
                  />
                  <div className="tile-info">
                    <h4>{product.name}</h4>
                    <span className="tile-price">৳ {product.price}</span>
                  </div>
                  {selectedProduct?._id === product._id && (
                    <span className="tile-badge">✓</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Size selector in sidebar */}
          {selectedProduct?.sizes?.length > 0 && (
            <div style={{
              padding: '16px 28px',
              borderTop: '1px solid rgba(255,255,255,0.04)'
            }}>
              <p style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#888',
                marginBottom: '12px'
              }}>Select Size</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedProduct.sizes.map((sizeData, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(sizeData.size)}
                    disabled={sizeData.stock <= 0}
                    style={{
                      minWidth: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      border: selectedSize === sizeData.size
                        ? '1px solid #d4af37'
                        : '1px solid rgba(255,255,255,0.06)',
                      background: selectedSize === sizeData.size
                        ? 'rgba(212, 175, 55, 0.1)'
                        : 'transparent',
                      color: selectedSize === sizeData.size ? '#d4af37' : '#888',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: sizeData.stock > 0 ? 'pointer' : 'not-allowed',
                      opacity: sizeData.stock > 0 ? 1 : 0.3,
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.3s'
                    }}
                  >
                    {sizeData.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="sidebar-footer">
            <span>Products</span>
            <span className="count">{filteredProducts.length}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default TryOn;
