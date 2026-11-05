import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { useTheme } from '../components/ThemeContext';
import './Products.css';

function Products() {
  const { darkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
    setLoading(false);
  };

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  let filtered = products.filter((p) => {
    const matchCategory = category === 'All' || p.category === category;
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filtered = [...filtered].sort((a, b) => a.name?.localeCompare(b.name));
  }

  const clearFilters = () => {
    setCategory('All');
    setSearch('');
    setSortBy('default');
  };

  const SkeletonCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-text">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line medium"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  );

  return (
    <div className={`products-luxe ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      <section className="products-hero">
        <h1>The <em>Collection</em></h1>
        <p>Handpicked pieces designed for those who refuse to blend in. Every item tells a story.</p>
        {!loading && (
          <div className="product-count">
            <span>{filtered.length}</span> Products Found
          </div>
        )}
      </section>

      <div className="sticky-toolbar">
        <div className="toolbar-inner">
          <div className="search-luxe">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={category === cat ? 'pill active' : 'pill'}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sort-luxe">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
            <span className="sort-arrow">▼</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="no-results-luxe">
              <div className="icon">🔍</div>
              <h2>No products found</h2>
              <p>We could not find any products matching your search. Try adjusting your filters or browse all products.</p>
              <button className="clear-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid-luxe">
              {filtered.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="product-card-luxe"
                >
                  <div className="card-image-wrap">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    {product.isNew && <span className="card-badge">New</span>}
                    <div className="card-overlay">
                      <span className="quick-view">Quick View</span>
                    </div>
                  </div>
                  <div className="card-info">
                    <p className="card-category">{product.category || 'Collection'}</p>
                    <h3>{product.name}</h3>
                    <div className="card-footer">
                      <span className="card-price">
                        ৳ {product.price}
                        <span> BDT</span>
                      </span>
                      {product.rating && (
                        <span className="card-rating">
                          <span className="star">★</span>
                          {product.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Products;
