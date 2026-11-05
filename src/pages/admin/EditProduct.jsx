import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getProducts, updateProduct } from '../../services/productService';
import './ProductForm.css';

function EditProduct() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    rating: '4.5',
    description: '',
    image: '',
    stock: '0',
    sizes: 'S, M, L, XL',
    video: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]); // 🔥 Notun
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.product) {
      const p = location.state.product;
      setFormData({
        name: p.name || '',
        price: p.price || '',
        category: p.category || '',
        rating: p.rating || '4.5',
        description: p.description || '',
        image: p.image || '',
        stock: p.stock || '0',
        sizes: p.sizes ? p.sizes.join(', ') : 'S, M, L, XL',
        video: p.video || '',
      });
    } else {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    const products = await getProducts();
    const found = products.find((p) => p._id === id);
    if (found) {
      setFormData({
        name: found.name || '',
        price: found.price || '',
        category: found.category || '',
        rating: found.rating || '4.5',
        description: found.description || '',
        image: found.image || '',
        stock: found.stock || '0',
        sizes: found.sizes ? found.sizes.join(', ') : 'S, M, L, XL',
        video: found.video || '',
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProduct(
        id,
        {
          ...formData,
          price: Number(formData.price),
          rating: Number(formData.rating),
          stock: Number(formData.stock),
        },
        imageFile,
        galleryFiles // 🔥 Gallery files pathao
      );
      alert('Product updated successfully! ✅');
      navigate('/admin');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="product-form-page">
      <div className="product-form-box">
        <h1>✏️ Edit Product</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Product Name *
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label>
            Price (৳) *
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </label>

          <label>
            Category *
            <input type="text" name="category" value={formData.category} onChange={handleChange} required />
          </label>

          <label>
            Rating (1-5)
            <input type="number" name="rating" value={formData.rating} onChange={handleChange} step="0.1" min="1" max="5" />
          </label>

          <label>
            Stock Quantity *
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="50" required />
          </label>

          <label>
            Sizes (Comma separated)
            <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} placeholder="S, M, L, XL" />
          </label>

          <label>
            Video Link (YouTube Embed)
            <input type="text" name="video" value={formData.video} onChange={handleChange} placeholder="https://www.youtube.com/embed/..." />
          </label>

          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
          </label>

          <label>
            New Main Image (optional — na dile purono ta thakbe)
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </label>

          {/* 🔥 Gallery Images Input */}
          <label>
            Add New Gallery Images (Multiple Select)
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={(e) => setGalleryFiles(Array.from(e.target.files))} 
            />
          </label>

          {formData.image && (
            <div>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>Current Main Image:</p>
              <img src={formData.image} alt="current" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin')} className="btn-cancel">Cancel</button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;