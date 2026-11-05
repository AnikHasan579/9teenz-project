import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';  // 🌓 Global Theme
import { getProducts } from '../services/productService';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  // 🌓 Global Theme — local state নয়, Context থেকে
  const { darkMode } = useTheme();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Welcome to the inner circle! 🥂');
    setEmail('');
  };

  const marqueeText = Array(10).fill('Free Shipping Over ৳3000 · New Drops Every Friday · Premium Quality Guaranteed · ');

  return (
    <div className={`luxe-home ${darkMode ? 'theme-dark' : 'theme-light'}`}>

      {/* ===== HERO ===== */}
      <section className="hero-luxe">
        <div className="hero-text-side">
          <span className="hero-eyebrow">Curated Collection 2025</span>
          <h1>
            Wear the <br />
            <em>Extraordinary</em>
          </h1>
          <p className="hero-desc">
            Handpicked pieces that blend timeless elegance with modern edge.
            Each item tells a story — make it yours.
          </p>
          <div className="hero-cta-group">
            <Link to="/products" className="btn-gold">Explore Collection</Link>
            <Link to="/tryon" className="btn-ghost">
              Virtual Try-On <span>→</span>
            </Link>
          </div>
        </div>
        <div className="hero-visual-side">
          <div className="hero-image-frame">
            <img
              src="https://i.pinimg.com/736x/8f/51/9a/8f519a5e06f0489a172fc5e8a6bbe02b.jpg"
              alt="Luxury Fashion"
            />
          </div>
          <div className="floating-card">
            <p>This Week Only</p>
            <h4>৳2,499</h4>
          </div>
        </div>
        <div className="scroll-hint">
          <span>↓</span>
          <span>Scroll</span>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="marquee-strip">
        <div className="marquee-content">
          {marqueeText.map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      {/* ===== FEATURED PRODUCTS (BENTO GRID) ===== */}
      <section className="featured-luxe">
        <div className="section-top">
          <h2>
            Featured <br />
            <em>Arrivals</em>
          </h2>
          <Link to="/products" className="link-arrow">
            View All Collection <span>→</span>
          </Link>
        </div>

        {loading ? (
          <p className="loading-luxe">Loading Collection...</p>
        ) : (
          <div className="bento-grid">
            {products.map((product, index) => {
              const isLarge = index === 0;
              const isWide = index === 1 || index === 2;
              return (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className={`bento-item ${isLarge ? 'bento-large' : ''} ${isWide ? 'bento-wide' : ''}`}
                >
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <div className="bento-overlay">
                    <h3>{product.name}</h3>
                    <p>৳ {product.price}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== STORY SECTION ===== */}
      <section className="story-section">
        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
            alt="Our Store"
          />
          <div className="story-badge">
            <span>5+</span>
            <p>Years</p>
          </div>
        </div>
        <div className="story-text">
          <h2>
            Crafted for Those <br />
            <em>Who Dare</em> to Stand Out
          </h2>
          <p>
            We believe fashion is more than fabric — it is identity, expression,
            and confidence woven into every thread. Since 2020, we have been
            curating pieces that do not just follow trends, but set them.
          </p>
          <p>
            Every product in our collection is hand-selected for quality,
            sustainability, and that unmistakable edge that turns heads.
          </p>
          <Link to="/about" className="btn-gold" style={{ display: 'inline-block', marginTop: '10px' }}>
            Our Story
          </Link>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <div className="stats-bar">
        <div className="stat-item">
          <h3>12K+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="stat-item">
          <h3>500+</h3>
          <p>Premium Products</p>
        </div>
        <div className="stat-item">
          <h3>50+</h3>
          <p>Brand Partners</p>
        </div>
        <div className="stat-item">
          <h3>24h</h3>
          <p>Fast Delivery</p>
        </div>
      </div>

      {/* ===== NEWSLETTER ===== */}
      <section className="newsletter-luxe">
        <h2>Join the Inner Circle</h2>
        <p>Be the first to know about exclusive drops, secret sales, and style tips.</p>
        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>

    </div>
  );
}

export default Home;
