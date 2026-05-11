import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = 'https://server-xb4a.onrender.com/api';
export const API_BASE = API_URL.replace(/\/api$/, '');

/** Resolve a possibly-relative media URL (e.g. `/uploads/xxx.jpg`) to an absolute URL. */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT from AsyncStorage
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@urbanav_token');
    if (token && token !== 'mock-token') {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  google: (data: { idToken: string; userType?: 'buyer' | 'supplier' }) =>
    api.post('/auth/google', data),
  forgotPassword: (data: any) => api.post('/auth/forgot-password', data),
  verifyOTP: (data: any) => api.post('/auth/verify-otp', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const equipmentAPI = {
  getAll: (params?: any) => api.get('/equipment', { params }),
  getMine: () => api.get('/equipment/mine'),
  getById: (id: string) => api.get(`/equipment/${id}`),
  create: (data: any) => api.post('/equipment', data),
  update: (id: string, data: any) => api.put(`/equipment/${id}`, data),
  delete: (id: string) => api.delete(`/equipment/${id}`),
  getByCategory: (category: string) => api.get(`/equipment/category/${category}`),
};

export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getSupplierOrders: () => api.get('/orders/supplier'),
  updateStatus: (id: string, data: any) => api.put(`/orders/${id}/status`, data),
  cancel: (id: string) => api.put(`/orders/${id}/cancel`),
  processPayment: (id: string, data: any) => api.put(`/orders/${id}/pay`, data),
};

export const chatAPI = {
  getChatByOrder: (orderId: string) => api.get(`/chat/order/${orderId}`),
  getMessages: (chatId: string) => api.get(`/chat/${chatId}/messages`),
  sendMessage: (chatId: string, data: any) => api.post(`/chat/${chatId}/messages`, data),
  markAsRead: (chatId: string) => api.put(`/chat/${chatId}/read`),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export const requirementAPI = {
  create: (data: any) => api.post('/requirements', data),
  getMy: () => api.get('/requirements/me'),
  getById: (id: string) => api.get(`/requirements/${id}`),
  getOffers: (id: string) => api.get(`/requirements/${id}/offers`),
  selectOffer: (id: string, inquiryId: string) => api.patch(`/requirements/${id}/select-offer`, { inquiryId }),
  close: (id: string) => api.patch(`/requirements/${id}/close`),
};

export const matchAPI = {
  forRequirement: (requirementId: string) => api.get(`/match`, { params: { requirementId } }),
};

export const inquiryAPI = {
  create: (data: any) => api.post('/inquiries', data),
  getForRequirement: (requirementId: string) => api.get(`/inquiries`, { params: { requirementId } }),
  respond: (id: string, data: any) => api.patch(`/inquiries/${id}/respond`, data),
  accept: (id: string) => api.patch(`/inquiries/${id}/accept`),
};

export const otpAPI = {
  generate: (bookingId: string) => api.post('/otp/generate', { bookingId }),
  verifyStart: (bookingId: string, otp: string) => api.post('/otp/verify-start', { bookingId, otp }),
  verifyEnd: (bookingId: string, otp: string) => api.post('/otp/verify-end', { bookingId, otp }),
};

export const reviewAPI = {
  create: (data: any) => api.post('/reviews', data),
  forVendor: (vendorId: string) => api.get(`/reviews/vendor/${vendorId}`),
};

export const addressesAPI = {
  list: () => api.get('/addresses'),
  create: (data: any) => api.post('/addresses', data),
  update: (id: string, data: any) => api.put(`/addresses/${id}`, data),
  remove: (id: string) => api.delete(`/addresses/${id}`),
  setDefault: (id: string) => api.put(`/addresses/${id}/default`),
};

// Multipart upload using FormData. Works both in React Native (file://) and web (blob:).
const isWeb = Platform.OS === 'web';

async function appendFile(form: FormData, uri: string, filename: string, mimeType: string) {
  if (isWeb) {
    // On web, expo-image-picker returns a blob:/data: URI; fetch it to a real Blob
    // so the browser can build a valid multipart body with the correct boundary.
    const resp = await fetch(uri);
    const blob = await resp.blob();
    // Cast because RN's FormData typing only allows 2 args, but on web the native
    // FormData.append supports the (name, blob, filename) 3-arg signature.
    (form as any).append('file', blob, filename);
  } else {
    // React Native FormData requires the { uri, name, type } shape.
    form.append('file', { uri, name: filename, type: mimeType } as any);
  }
}

export const uploadAPI = {
  avatar: async (uri: string, mimeType = 'image/jpeg') => {
    const form = new FormData();
    const filename = uri.split('/').pop()?.split('?')[0] || `avatar-${Date.now()}.jpg`;
    await appendFile(form, uri, filename, mimeType);
    return api.post('/upload/avatar', form, {
      // On web, let the browser set Content-Type with boundary automatically.
      headers: isWeb ? {} : { 'Content-Type': 'multipart/form-data' },
      transformRequest: (d) => d, // prevent axios JSON-stringifying FormData
    });
  },
  image: async (uri: string, folder = 'misc', mimeType = 'image/jpeg') => {
    const form = new FormData();
    const filename = uri.split('/').pop()?.split('?')[0] || `img-${Date.now()}.jpg`;
    await appendFile(form, uri, filename, mimeType);
    form.append('folder', folder);
    return api.post('/upload/image', form, {
      headers: isWeb ? {} : { 'Content-Type': 'multipart/form-data' },
      transformRequest: (d) => d,
    });
  },
};

export default api;
