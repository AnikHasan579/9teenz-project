const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateOrderAddress,
  deleteOrder,
} = require('../controllers/orderController');
const { protectUser, protect } = require('../middleware/auth');

router.post('/', protectUser, createOrder);
router.get('/myorders', protectUser, getMyOrders);
router.get('/:id', protectUser, getOrderById);
router.get('/', protect, getAllOrders);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/address', protect, updateOrderAddress); // 🔥 Address Update Route
router.delete('/:id', protect, deleteOrder);

module.exports = router;