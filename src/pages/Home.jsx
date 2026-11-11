import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import { getProducts } from '../services/productService';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
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
    alert('Welcome to the symbiote circle!');
    setEmail('');
  };

  const marqueeText = Array(10).fill('Free Shipping Over ৳3000 · New Drops Every Friday · Premium Quality Guaranteed · ');

  return (
    <div className={`venom-home ${darkMode ? 'theme-dark' : 'theme-light'}`}>

      {/* Symbiote Background Effects */}
      <div className="symbiote-bg">
        <div className="gooey-blob blob-1"></div>
        <div className="gooey-blob blob-2"></div>
        <div className="gooey-blob blob-3"></div>
        <div className="venom-veins"></div>
      </div>

      {/* ===== HERO ===== */}
      <section className="venom-hero">
        <div className="hero-text-side">
          <span className="hero-eyebrow">Symbiote Collection 2025</span>
          <h1 className="glitch-text" data-text="WEAR THE DARKNESS">
            Wear the <br />
            <em>Darkness</em>
          </h1>
          <p className="hero-desc">
            Unleash your inner edge. Handpicked pieces that merge street culture
            with symbiote aesthetics. Bold, unapologetic, and impossible to ignore.
          </p>
          <div className="hero-cta-group">
            <Link to="/products" className="btn-venom">Explore Collection</Link>
            <Link to="/tryon" className="btn-venom-ghost">
              Virtual Try-On <span>→</span>
            </Link>
          </div>
        </div>
        <div className="hero-visual-side">
          <div className="hero-image-frame">
            <div className="venom-frame-glow"></div>
            <img
              src="https://i.pinimg.com/736x/8f/51/9a/8f519a5e06f0489a172fc5e8a6bbe02b.jpg"
              alt="Venom Fashion"
            />
          </div>
          <div className="floating-card venom-card">
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
      <div className="venom-marquee">
        <div className="marquee-content">
          {marqueeText.map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      {/* ===== FEATURED PRODUCTS (BENTO GRID) ===== */}
      <section className="venom-featured">
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
          <div className="venom-loading">
            <div className="venom-spinner"></div>
            <p>Loading Collection...</p>
          </div>
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
                  <div className="venom-tentacle"></div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== STORY SECTION ===== */}
      <section className="venom-story">
        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
            alt="Our Store"
          />
          <div className="story-badge">
            <span>3+</span>
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
          <Link to="/about" className="btn-venom" style={{ display: 'inline-block', marginTop: '10px' }}>
            Our Story
          </Link>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <div className="venom-stats">
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
      <section className="venom-newsletter">
        <h2>Join the Symbiote Circle</h2>
        <p>Be the first to know about exclusive drops, secret sales, and dark style tips.</p>
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
