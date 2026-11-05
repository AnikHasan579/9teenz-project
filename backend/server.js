const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

const app = express();

// ✅ CORS (শুধুমাত্র আপনার নতুন ডোমেইন এবং লোকাল ডেভেলপমেন্টের জন্য)
app.use(cors({
  origin: [
    'https://9teenz.vercel.app',          // 👈 আপনার নতুন ডোমেইন
    'http://localhost:5173',              // লোকাল ডেভেলপমেন্টের জন্য
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ===== CLOUDINARY CONFIG =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// ===== ROUTES =====
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
  res.json({ message: '9teenz API running 🚀' });
});

app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));