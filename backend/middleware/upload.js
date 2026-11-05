const multer = require('multer');

// ✅ Memory Storage ব্যবহার করুন (Cloudinary-তে সরাসরি পাঠানোর জন্য)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Image এবং Video দুটোই allow করুন
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos allowed'), false);
  }
};

// ৫০ মেগাবাইট পর্যন্ত ফাইল allow করা হলো
module.exports = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } 
});