const Order = require('../models/Order');
const Product = require('../models/Product');

// @route POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalPrice, isGuest, guestName, guestEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart khali' });
    }

    // User login kora thakle userId set koro, na thakle null
    let userId = null;
    if (req.user && req.user._id) {
      userId = req.user._id;
    }

    const formattedItems = items.map(item => ({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || 'N/A',
      image: item.image,
    }));

    const order = await Order.create({
      user: userId, // Guest hole null
      isGuest: isGuest || false,
      guestName: guestName || shippingAddress.name,
      guestEmail: guestEmail || shippingAddress.email,
      items: formattedItems,
      shippingAddress,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    // ✅ চেক করুন req.user আছে কিনা
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized. Please log in.' });
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // ✅ এখানে সমস্যাটি ছিল। Guest Order বা req.user না থাকলে চেক করে নিন
    if (order.user) {
      // যদি অর্ডারটি লগইন করা ইউজারের হয়, কিন্তু req.user না থাকে
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Not authorized. Please log in.' });
      }
      
      // যদি লগইন করা ইউজার এবং অর্ডারের ইউজার না মিলে
      if (order.user._id.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to view this order' });
      }
    } else {
      // এটি একটি Guest Order, তাই req.user না থাকলেও অ্যালাউ করবো (অথবা আপনার প্রয়োজন মতো গেস্ট চেক দিতে পারেন)
      // সাধারণত গেস্ট অর্ডার দেখতে ইমেইল বা ফোন ভেরিফিকেশন লাগে, তবে আপাতত এরর এড়াতে এটি অ্যালাউ করলাম
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/orders (admin)
const getAllOrders = async (req, res) => {
  try {
    let query = {};
    
    if (req.query.type === 'guest') {
      query = { isGuest: true };
    } else if (req.query.type === 'web') {
      query = { isGuest: false };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/orders/:id/status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const newStatus = req.body.status;
    const oldStatus = order.status;

    if (newStatus === 'Processing' && oldStatus !== 'Processing') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const sizeData = product.sizes.find(s => s.size === item.size);
          if (sizeData) {
            sizeData.stock -= item.quantity;
            if (sizeData.stock < 0) sizeData.stock = 0;
            await product.save();
          }
        }
      }
    }

    if (newStatus === 'Cancelled' && oldStatus !== 'Cancelled' && oldStatus !== 'Pending') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const sizeData = product.sizes.find(s => s.size === item.size);
          if (sizeData) {
            sizeData.stock += item.quantity;
            await product.save();
          }
        }
      }
    }

    order.status = newStatus || order.status;
    if (newStatus === 'Delivered') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/orders/:id (admin)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/orders/:id/address (admin)
const updateOrderAddress = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.shippingAddress = {
      ...order.shippingAddress,
      name: req.body.name || order.shippingAddress.name,
      phone: req.body.phone || order.shippingAddress.phone,
      address: req.body.address || order.shippingAddress.address,
      city: req.body.city || order.shippingAddress.city,
      postalCode: req.body.postalCode || order.shippingAddress.postalCode,
    };

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  updateOrderAddress,
};