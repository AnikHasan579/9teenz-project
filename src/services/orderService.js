import API from './api';

export const createOrder = async (orderData) => {
  const res = await API.post('/orders', orderData);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await API.get('/orders/myorders');
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await API.get(`/orders/${id}`);
  return res.data;
};

// 🔥 Ei function ta update koro (type parameter add)
export const getAllOrders = async (type) => {
  const url = type ? `/orders?type=${type}` : '/orders';
  const res = await API.get(url);
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await API.put(`/orders/${id}/status`, { status });
  return res.data;
};

export const updateOrderAddress = async (id, addressData) => {
  const res = await API.put(`/orders/${id}/address`, addressData);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await API.delete(`/orders/${id}`);
  return res.data;
};