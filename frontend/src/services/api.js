// API Integration service for LifePause
const BASE_URL = (import.meta.env.VITE_API_URL || 'https://lifepause-backend.vercel.app/api').trim();

// HTTP Request Helper
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('lp_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// API Services (100% Real Full-Stack Integration)
export const api = {
  // Check Mode (Always returns false because offline simulation mode is completely disabled)
  isOfflineMode: () => false,

  // Auth Endpoints
  auth: {
    register: async (name, email, password) => {
      return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
    },

    login: async (email, password) => {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },

    getMe: async () => {
      return request('/auth/me');
    },

    updateMedical: async (profileData) => {
      return request('/auth/medical', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    },

    updateSubscription: async (plan, familyMembers = []) => {
      return request('/auth/subscription', {
        method: 'PUT',
        body: JSON.stringify({ plan, familyMembers })
      });
    },

    forgotPassword: async (email) => {
      return request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    },

    resetPassword: async (email, code, newPassword) => {
      return request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, code, newPassword })
      });
    }
  },

  // Vault Endpoints
  vault: {
    getAll: async () => {
      return request('/vault');
    },

    create: async (title, category, content) => {
      return request('/vault', {
        method: 'POST',
        body: JSON.stringify({ title, category, content })
      });
    },

    update: async (id, updatedFields) => {
      return request(`/vault/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedFields)
      });
    },

    delete: async (id) => {
      return request(`/vault/${id}`, { method: 'DELETE' });
    },

    toggleFavorite: async (id) => {
      return request(`/vault/${id}/favorite`, { method: 'PUT' });
    },

    toggleArchive: async (id) => {
      return request(`/vault/${id}/archive`, { method: 'PUT' });
    }
  },

  // Documents Endpoints
  documents: {
    getAll: async () => {
      return request('/documents');
    },

    create: async (title, category, fileName, expiryDate, notes) => {
      return request('/documents', {
        method: 'POST',
        body: JSON.stringify({ title, category, fileName, expiryDate, notes })
      });
    },

    update: async (id, updatedFields) => {
      return request(`/documents/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedFields)
      });
    },

    delete: async (id) => {
      return request(`/documents/${id}`, { method: 'DELETE' });
    }
  },

  // Contacts Endpoints
  contacts: {
    getAll: async () => {
      return request('/contacts');
    },

    create: async (name, email, phone, relationship, permission) => {
      return request('/contacts', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, relationship, permission })
      });
    },

    update: async (id, updatedFields) => {
      return request(`/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedFields)
      });
    },

    delete: async (id) => {
      return request(`/contacts/${id}`, { method: 'DELETE' });
    },

    verify: async (id) => {
      return request(`/contacts/${id}/verify`, { method: 'PUT' });
    }
  },

  // Reminders Endpoints
  reminders: {
    getAll: async () => {
      return request('/reminders');
    },

    create: async (title, category, dueDate, notes) => {
      return request('/reminders', {
        method: 'POST',
        body: JSON.stringify({ title, category, dueDate, notes })
      });
    },

    update: async (id, updatedFields) => {
      return request(`/reminders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedFields)
      });
    },

    delete: async (id) => {
      return request(`/reminders/${id}`, { method: 'DELETE' });
    }
  },

  // Emergency Setting Endpoints
  emergency: {
    getSettings: async () => {
      return request('/emergency/settings');
    },

    updateSettings: async (settingsData) => {
      return request('/emergency/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsData)
      });
    },

    triggerCountdown: async () => {
      return request('/emergency/trigger-countdown', { method: 'POST' });
    },

    triggerSOS: async () => {
      return request('/emergency/trigger-sos', { method: 'POST' });
    },

    cancelSOS: async () => {
      return request('/emergency/cancel', { method: 'POST' });
    }
  },

  // Notification Endpoints
  notifications: {
    getAll: async () => {
      return request('/notifications');
    },

    markRead: async (id) => {
      return request(`/notifications/${id}/read`, { method: 'PUT' });
    },

    markAllRead: async () => {
      return request('/notifications/read-all', { method: 'PUT' });
    },

    delete: async (id) => {
      return request(`/notifications/${id}`, { method: 'DELETE' });
    }
  }
};

export default api;
