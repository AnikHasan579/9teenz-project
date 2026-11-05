const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    video: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    
    // 🔥 Notun Size-wise Stock Model
    sizes: [
      {
        size: { type: String, required: true }, // S, M, L
        stock: { type: Number, required: true, default: 0 }
      }
    ],
    
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);