const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all the fields.' });
  }

  // 🔥 BACKEND STRONG PASSWORD VALIDATION
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{11,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      message: 'Password must be at least 11 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&#).' 
    });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/users/forgot-password
// @desc Send OTP to email
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'There is no user associated with this email address.' });
    }

    // 6 digit OTP Generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetOtp = otp;
    user.resetOtpExpire = otpExpire;
    await user.save();

    // Email Pathano
    await transporter.sendMail({
      from: `"9teenz 🛒" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Password Reset OTP - 9teenz',
      html: `
        <div style="font-family: Arial; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #e94560;">9teenz 🛒</h1>
            <h2 style="color: #1a1a2e;">Password Reset OTP</h2>
            <p>Tomar password reset korার jonno ei OTP ta use koro:</p>
            <div style="background: #e94560; color: white; padding: 20px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #888; font-size: 14px;">Ei OTP ta 10 minute por expire hobe.</p>
            <p style="color: #888; font-size: 12px;">Tumi request koro nai? Ignore koro ei email ta.</p>
          </div>
        </div>
      `,
    });

    return res.json({ message: 'An OTP has been sent to your email address. Please check your inbox. ✅' });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ message: 'There was a problem sending the email. ' + err.message });
  }
};

// @route POST /api/users/reset-password
// @desc Verify OTP and set new password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // 1. Validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{11,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ message: 'Password e minimum 11 character, 1 ta Capital letter, 1 ta Small letter, 1 ta Number ar 1 ta Special character (@$!%*?&#) thakte hobe!' });
  }

  try {
    // 2. User check koro
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. OTP check koro (sompurno match korte hobe)
    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: 'The OTP is incorrect! Please check and try again.' });
    }

    // 4. OTP expire check koro (10 min)
    if (user.resetOtpExpire < Date.now()) {
      return res.status(400).json({ message: 'The OTP has expired! Please request a new OTP.' });
    }

    // 5. Sob thik thakle notun password set koro
    user.password = newPassword;
    user.resetOtp = null;        // OTP clear koro jate abar use na hoy
    user.resetOtpExpire = null;  // OTP time clear koro
    await user.save();

    return res.json({ message: 'Your password has been reset successfully! ✅ Please log in using your new password.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};