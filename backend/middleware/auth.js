const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

// 🔥 Admin JWT verify (Strict - Token must lagbe)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'No token' });
  }
};

// 🔥 User JWT verify (Optional - Login kora thakle user dhore, na thakle guest hishebe next() kore)
const protectUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      // Token invalid/expired hole Guest hishebe continue korbe
      req.user = null;
      next();
    }
  } else {
    // Token na thakle Guest hishebe continue korbe (Ei jonno ekhon error dibe na)
    req.user = null;
    next();
  }
};

module.exports = { protect, protectUser };