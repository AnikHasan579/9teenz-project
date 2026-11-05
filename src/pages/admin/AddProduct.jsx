import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../../services/productService';
import './ProductForm.css';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    rating: '4.5',
    description: '',
  });
  
  // 🔥 Dynamic Sizes & Stock State
  const [sizes, setSizes] = useState([
    { size: 'S', stock: 0 },
    { size: 'M', stock: 0 },
    { size: 'L', stock: 0 },
    { size: 'XL', stock: 0 },
  ]);

  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Main Image select koro!');
      return;
    }
    setLoading(true);

    try {
      await addProduct(
        {
          ...formData,
          price: Number(formData.price),
          rating: Number(formData.rating),
          sizes: JSON.stringify(sizes), // Array ke JSON string banaye pathao
        },
        imageFile,
        galleryFiles,
        videoFile
      );
      alert('Product added successfully! ✅');
      navigate('/admin');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="product-form-page">
      <div className="product-form-box">
        <h1>➕ Add New Product</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Product Name *
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Classic White T-Shirt" required />
          </label>

          <label>
            Price (৳) *
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="599" required />
          </label>

          <label>
            Category *
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="T-Shirt" required />
          </label>

          <label>
            Rating (1-5)
            <input type="number" name="rating" value={formData.rating} onChange={handleChange} step="0.1" min="1" max="5" />
          </label>

          {/* 🔥 Size & Stock Inputs */}
          <div style={{ marginTop: '10px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '10px' }}>Sizes & Stock</h4>
            {sizes.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input 
                  type="text" 
                  value={item.size} 
                  onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                  placeholder="Size (S, M, L)"
                  style={{ width: '80px', padding: '8px' }}
                />
                <input 
                  type="number" 
                  value={item.stock} 
                  onChange={(e) => handleSizeChange(index, 'stock', Number(e.target.value))}
                  placeholder="Stock"
                  style={{ width: '80px', padding: '8px' }}
                />
              </div>
            ))}
          </div>

          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product description..." rows="3" />
          </label>

          <label>
            Product Main Image *
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />
          </label>

          <label>
            Gallery Images (Multiple Select)
            <input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(Array.from(e.target.files))} />
          </label>

          <label>
            Product Video (MP4)
            <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
          </label>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin')} className="btn-cancel">Cancel</button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;