import API from './api';

export const getProducts = async () => {
  const res = await API.get('/products');
  return res.data;
};

export const getProductById = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const addProduct = async (productData, imageFile, galleryFiles, videoFile) => {
  const formData = new FormData();
  
  // টেক্সট ডেটাগুলো (name, price, sizes ইত্যাদি) অ্যাপেন্ড করুন
  Object.keys(productData).forEach((key) => {
    formData.append(key, productData[key]);
  });
  
  // Main Image
  if (imageFile) {
    formData.append('image', imageFile); 
  }
  
  // Gallery Images (Multiple)
  if (galleryFiles && galleryFiles.length > 0) {
    galleryFiles.forEach((file) => {
      formData.append('galleryImages', file);
    });
  }

  // Video File
  if (videoFile) {
    formData.append('video', videoFile);
  }

  // ❗ headers ডিলিট করে দিয়েছি, শুধু formData পাঠান
  const res = await API.post('/products', formData);
  return res.data;
};

export const updateProduct = async (id, productData, imageFile, galleryFiles, videoFile) => {
  const formData = new FormData();
  
  Object.keys(productData).forEach((key) => {
    formData.append(key, productData[key]);
  });
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  if (galleryFiles && galleryFiles.length > 0) {
    galleryFiles.forEach((file) => {
      formData.append('galleryImages', file);
    });
  }

  if (videoFile) {
    formData.append('video', videoFile);
  }

  // ❗ এখানেও headers ডিলিট করে দিয়েছি
  const res = await API.put(`/products/${id}`, formData);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};