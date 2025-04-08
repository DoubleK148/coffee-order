export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const config = {
  apiUrl: API_URL,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      refreshToken: '/api/auth/refresh-token',
      forgotPassword: '/api/auth/forgot-password',
      resetPassword: '/api/auth/reset-password'
    },
    users: {
      profile: '/api/users/profile',
      updateProfile: '/api/users/profile',
      list: '/api/admin/users',
      details: (id: string) => `/api/admin/users/${id}`,
      update: (id: string) => `/api/admin/users/${id}`,
      delete: (id: string) => `/api/admin/users/${id}`
    },
    products: {
      list: '/api/products',
      details: (id: string) => `/api/products/${id}`,
      create: '/api/admin/products',
      update: (id: string) => `/api/admin/products/${id}`,
      delete: (id: string) => `/api/admin/products/${id}`
    },
    tables: {
      list: '/api/tables',
      details: (id: string) => `/api/tables/${id}`,
      create: '/api/admin/tables',
      update: (id: string) => `/api/admin/tables/${id}`,
      delete: (id: string) => `/api/admin/tables/${id}`,
      reset: '/api/admin/tables/reset'
    },
    orders: {
      create: '/api/orders',
      myOrders: '/api/orders/my',
      details: (id: string) => `/api/orders/${id}`,
      list: '/api/admin/orders',
      adminDetails: (id: string) => `/api/admin/orders/${id}`,
      update: (id: string) => `/api/admin/orders/${id}`,
      delete: (id: string) => `/api/admin/orders/${id}`,
      updateStatus: (id: string) => `/api/admin/orders/${id}/status`
    },
    reservations: {
      create: '/api/reservations',
      myReservations: '/api/reservations/my',
      details: (id: string) => `/api/reservations/${id}`,
      list: '/api/admin/reservations',
      adminDetails: (id: string) => `/api/admin/reservations/${id}`,
      update: (id: string) => `/api/admin/reservations/${id}`,
      delete: (id: string) => `/api/admin/reservations/${id}`
    },
    payment: {
      momo: '/api/payment/momo/create',
      momoVerify: '/api/payment/momo/verify',
      momoIpn: '/api/payment/momo/ipn'
    }
  }
}; 