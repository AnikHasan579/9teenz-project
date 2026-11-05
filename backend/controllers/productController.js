const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// ✅ বাফার থেকে Cloudinary-তে আপলোড করার হেল্পার ফাংশন
const uploadBufferToCloudinary = (buffer, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: '9teenz', resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer); // স্ট্রিমে বাফার পুশ করা হলো
  });
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, category, rating, description, sizes } = req.body;

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Main Image required' });
    }

    // ১. Main Image আপলোড (buffer থেকে)
    const mainImageResult = await uploadBufferToCloudinary(req.files.image[0].buffer, 'image');
    
    // ২. Gallery Images আপলোড
    let galleryArray = [];
    if (req.files.galleryImages) {
      for (const file of req.files.galleryImages) {
        const result = await uploadBufferToCloudinary(file.buffer, 'image');
        galleryArray.push(result.secure_url);
      }
    }

    // ৩. Video আপলোড
    let videoUrl = '';
    if (req.files.video) {
      const videoResult = await uploadBufferToCloudinary(req.files.video[0].buffer, 'video');
      videoUrl = videoResult.secure_url;
    }

    // ৪. Sizes JSON parse
    let parsedSizes = [];
    if (sizes) {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }

    // ৫. ডেটাবেসে সেভ
    const product = await Product.create({
      name,
      price: Number(price),
      category,
      rating: Number(rating) || 4.5,
      description,
      sizes: parsedSizes,
      image: mainImageResult.secure_url,
      video: videoUrl,
      gallery: galleryArray,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });

    const { name, price, category, rating, description, sizes } = req.body;

    product.name = name || product.name;
    product.price = price ? Number(price) : product.price;
    product.category = category || product.category;
    product.rating = rating ? Number(rating) : product.rating;
    product.description = description || product.description;
    
    if (sizes) {
      product.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }

    if (req.files && req.files.image) {
      const mainImageResult = await uploadBufferToCloudinary(req.files.image[0].buffer, 'image');
      product.image = mainImageResult.secure_url;
    }

    if (req.files && req.files.galleryImages) {
      let galleryArray = [...product.gallery];
      for (const file of req.files.galleryImages) {
        const result = await uploadBufferToCloudinary(file.buffer, 'image');
        galleryArray.push(result.secure_url);
      }
      product.gallery = galleryArray;
    }

    if (req.files && req.files.video) {
      const videoResult = await uploadBufferToCloudinary(req.files.video[0].buffer, 'video');
      product.video = videoResult.secure_url;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};