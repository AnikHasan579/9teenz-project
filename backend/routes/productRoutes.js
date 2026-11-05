const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// 🔥 Image ar Video handle korার jonno
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },          // Main Image
  { name: 'galleryImages', maxCount: 5 },  // Gallery Images (max 5)
  { name: 'video', maxCount: 1 }           // Video File (max 1)
]);

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, uploadFields, createProduct);
router.put('/:id', protect, uploadFields, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;