import apiClient, { localStore, STORAGE_KEYS } from './api';
import { initialProfile } from './seedData';

// Helper to ensure both id and _id are available
const normalizeItem = (item) => {
  if (!item) return item;
  const id = item._id ? item._id.toString() : item.id;
  return { ...item, id, _id: id };
};

const normalizeList = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeItem);
};

// Helper to sanitize payload before sending PUT/POST (removes immutable _id/id)
const sanitizePayload = (data) => {
  const clean = { ...data };
  delete clean._id;
  delete clean.id;
  delete clean.createdAt;
  delete clean.updatedAt;
  delete clean.__v;
  return clean;
};

// Helper to generate IDs for locally created items
const uid = (prefix = 'item') => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

/* ================= AUTH SERVICE ================= */
export const authService = {
  login: async (username, password) => {
    try {
      const res = await apiClient.post('/auth/login', { username, password });
      if (res.data && res.data.token) {
        localStorage.setItem('portfolio_admin_token', res.data.token);
        localStorage.setItem('portfolio_admin_user', JSON.stringify(res.data.admin));
        return { success: true, data: res.data };
      }
    } catch (apiError) {
      console.warn('Backend login error, attempting demo fallback:', apiError.message);
    }

    // Fallback authentication check for demo/offline testing
    const defaultUsername = 'admin';
    const defaultPassword = 'admin123';

    if (
      (username.trim().toLowerCase() === defaultUsername && password === defaultPassword) ||
      (username.trim().toLowerCase() === 'anshika' && password === 'anshika123')
    ) {
      const mockAdmin = {
        id: 'admin-1',
        username: username.trim(),
        name: 'Anshika Gupta',
        role: 'Administrator'
      };
      const mockToken = `mock-jwt-token-${Date.now()}`;
      localStorage.setItem('portfolio_admin_token', mockToken);
      localStorage.setItem('portfolio_admin_user', JSON.stringify(mockAdmin));
      return { success: true, data: { token: mockToken, admin: mockAdmin } };
    }

    throw new Error('Invalid username or password. (Default: admin / admin123)');
  },

  getCurrentAdmin: () => {
    try {
      const user = localStorage.getItem('portfolio_admin_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('portfolio_admin_token');
    localStorage.removeItem('portfolio_admin_user');
  }
};

/* ================= UPLOAD SERVICE (CLOUDINARY) ================= */
export const uploadService = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 120000
    });
    return res.data; // { url, public_id, bytes, format }
  }
};

/* ================= PROFILE SERVICE ================= */
export const profileService = {
  getProfile: async () => {
    try {
      const res = await apiClient.get('/profile');
      if (res.data) {
        const norm = normalizeItem(res.data);
        localStore.set(STORAGE_KEYS.PROFILE, norm);
        return norm;
      }
    } catch (err) {
      console.warn('Profile fetch fallback:', err.message);
    }
    return localStore.get(STORAGE_KEYS.PROFILE, initialProfile);
  },

  updateProfile: async (profileData) => {
    try {
      const clean = sanitizePayload(profileData);
      const res = await apiClient.put('/profile', clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        localStore.set(STORAGE_KEYS.PROFILE, norm);
        return norm;
      }
    } catch (err) {
      console.warn('Profile update fallback:', err.message);
    }
    localStore.set(STORAGE_KEYS.PROFILE, profileData);
    return profileData;
  }
};

/* ================= PROJECTS SERVICE ================= */
export const projectService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/projects');
      if (Array.isArray(res.data)) {
        const norm = normalizeList(res.data);
        localStore.set(STORAGE_KEYS.PROJECTS, norm);
        return norm;
      }
    } catch (err) {
      console.warn('Projects fetch fallback:', err.message);
    }
    const projects = localStore.get(STORAGE_KEYS.PROJECTS, []);
    return normalizeList(projects).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  create: async (data) => {
    try {
      const clean = sanitizePayload(data);
      const res = await apiClient.post('/projects', clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.PROJECTS, []);
        list.push(norm);
        localStore.set(STORAGE_KEYS.PROJECTS, list);
        return norm;
      }
    } catch (err) {
      console.warn('Project create fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.PROJECTS, []);
    const newItem = {
      ...data,
      id: data.id || uid('proj'),
      order: list.length + 1
    };
    list.push(newItem);
    localStore.set(STORAGE_KEYS.PROJECTS, list);
    return newItem;
  },

  update: async (id, data) => {
    try {
      const clean = sanitizePayload(data);
      const res = await apiClient.put(`/projects/${id}`, clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.PROJECTS, []);
        const updated = list.map((item) => (item.id === id || item._id === id ? norm : item));
        localStore.set(STORAGE_KEYS.PROJECTS, updated);
        return norm;
      }
    } catch (err) {
      console.warn('Project update fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.PROJECTS, []);
    const updated = list.map((item) => (item.id === id || item._id === id ? { ...item, ...data } : item));
    localStore.set(STORAGE_KEYS.PROJECTS, updated);
    return data;
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/projects/${id}`);
    } catch (err) {
      console.warn('Project delete fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.PROJECTS, []);
    const filtered = list.filter((item) => item.id !== id && item._id !== id);
    localStore.set(STORAGE_KEYS.PROJECTS, filtered);
    return true;
  }
};

/* ================= PROJECT CATEGORIES SERVICE ================= */
export const projectCategoryService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/project-categories');
      if (Array.isArray(res.data)) {
        const norm = normalizeList(res.data);
        localStore.set(STORAGE_KEYS.PROJECT_CATEGORIES, norm);
        return norm;
      }
    } catch (err) {
      console.warn('Project categories fetch fallback:', err.message);
    }
    const categories = localStore.get(STORAGE_KEYS.PROJECT_CATEGORIES, []);
    return normalizeList(categories).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  create: async (data) => {
    try {
      const clean = sanitizePayload(typeof data === 'string' ? { name: data } : data);
      const res = await apiClient.post('/project-categories', clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.PROJECT_CATEGORIES, []);
        if (!list.some(c => (c.name || '').toLowerCase() === (norm.name || '').toLowerCase())) {
          list.push(norm);
          localStore.set(STORAGE_KEYS.PROJECT_CATEGORIES, list);
        }
        return norm;
      }
    } catch (err) {
      console.warn('Project category create fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.PROJECT_CATEGORIES, []);
    const name = (typeof data === 'string' ? data : data?.name || '').trim();
    if (!name) return null;
    const existing = list.find(c => (c.name || '').toLowerCase() === name.toLowerCase());
    if (existing) return existing;

    const newItem = {
      id: uid('cat'),
      name,
      order: list.length + 1
    };
    list.push(newItem);
    localStore.set(STORAGE_KEYS.PROJECT_CATEGORIES, list);
    return newItem;
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/project-categories/${id}`);
    } catch (err) {
      console.warn('Project category delete fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.PROJECT_CATEGORIES, []);
    const filtered = list.filter((item) => item.id !== id && item._id !== id && item.name !== id);
    localStore.set(STORAGE_KEYS.PROJECT_CATEGORIES, filtered);
    return true;
  }
};

/* ================= EXPERIENCE SERVICE ================= */
export const experienceService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/experience');
      if (Array.isArray(res.data)) {
        const norm = normalizeList(res.data);
        localStore.set(STORAGE_KEYS.EXPERIENCE, norm);
        return norm;
      }
    } catch (err) {
      console.warn('Experience fetch fallback:', err.message);
    }
    const exp = localStore.get(STORAGE_KEYS.EXPERIENCE, []);
    return normalizeList(exp).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  create: async (data) => {
    try {
      const clean = sanitizePayload(data);
      const res = await apiClient.post('/experience', clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.EXPERIENCE, []);
        list.push(norm);
        localStore.set(STORAGE_KEYS.EXPERIENCE, list);
        return norm;
      }
    } catch (err) {
      console.warn('Experience create fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.EXPERIENCE, []);
    const newItem = {
      ...data,
      id: data.id || uid('exp'),
      order: list.length + 1
    };
    list.push(newItem);
    localStore.set(STORAGE_KEYS.EXPERIENCE, list);
    return newItem;
  },

  update: async (id, data) => {
    try {
      const clean = sanitizePayload(data);
      const res = await apiClient.put(`/experience/${id}`, clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.EXPERIENCE, []);
        const updated = list.map((item) => (item.id === id || item._id === id ? norm : item));
        localStore.set(STORAGE_KEYS.EXPERIENCE, updated);
        return norm;
      }
    } catch (err) {
      console.warn('Experience update fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.EXPERIENCE, []);
    const updated = list.map((item) => (item.id === id || item._id === id ? { ...item, ...data } : item));
    localStore.set(STORAGE_KEYS.EXPERIENCE, updated);
    return data;
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/experience/${id}`);
    } catch (err) {
      console.warn('Experience delete fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.EXPERIENCE, []);
    const filtered = list.filter((item) => item.id !== id && item._id !== id);
    localStore.set(STORAGE_KEYS.EXPERIENCE, filtered);
    return true;
  }
};

/* ================= SKILLS SERVICE ================= */
export const skillService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/skills');
      if (Array.isArray(res.data)) {
        const norm = normalizeList(res.data);
        localStore.set(STORAGE_KEYS.SKILLS, norm);
        return norm;
      }
    } catch (err) {
      console.warn('Skills fetch fallback:', err.message);
    }
    const skills = localStore.get(STORAGE_KEYS.SKILLS, []);
    return normalizeList(skills).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  createCategory: async (data) => {
    try {
      const clean = sanitizePayload(data);
      const res = await apiClient.post('/skills', clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.SKILLS, []);
        list.push(norm);
        localStore.set(STORAGE_KEYS.SKILLS, list);
        return norm;
      }
    } catch (err) {
      console.warn('Skills create fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.SKILLS, []);
    const newItem = {
      ...data,
      id: data.id || uid('skill'),
      order: list.length + 1
    };
    list.push(newItem);
    localStore.set(STORAGE_KEYS.SKILLS, list);
    return newItem;
  },

  updateCategory: async (id, data) => {
    try {
      const clean = sanitizePayload(data);
      const res = await apiClient.put(`/skills/${id}`, clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.SKILLS, []);
        const updated = list.map((item) => (item.id === id || item._id === id ? norm : item));
        localStore.set(STORAGE_KEYS.SKILLS, updated);
        return norm;
      }
    } catch (err) {
      console.warn('Skills update fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.SKILLS, []);
    const updated = list.map((item) => (item.id === id || item._id === id ? { ...item, ...data } : item));
    localStore.set(STORAGE_KEYS.SKILLS, updated);
    return data;
  },

  deleteCategory: async (id) => {
    try {
      await apiClient.delete(`/skills/${id}`);
    } catch (err) {
      console.warn('Skills delete fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.SKILLS, []);
    const filtered = list.filter((item) => item.id !== id && item._id !== id);
    localStore.set(STORAGE_KEYS.SKILLS, filtered);
    return true;
  }
};

/* ================= EDUCATION SERVICE ================= */
export const educationService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/education');
      if (Array.isArray(res.data)) {
        const norm = normalizeList(res.data);
        localStore.set(STORAGE_KEYS.EDUCATION, norm);
        return norm;
      }
    } catch (err) {
      console.warn('Education fetch fallback:', err.message);
    }
    const edu = localStore.get(STORAGE_KEYS.EDUCATION, []);
    return normalizeList(edu).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  create: async (data) => {
    try {
      const clean = sanitizePayload(data);
      const res = await apiClient.post('/education', clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.EDUCATION, []);
        list.push(norm);
        localStore.set(STORAGE_KEYS.EDUCATION, list);
        return norm;
      }
    } catch (err) {
      console.warn('Education create fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.EDUCATION, []);
    const newItem = {
      ...data,
      id: data.id || uid('edu'),
      order: list.length + 1
    };
    list.push(newItem);
    localStore.set(STORAGE_KEYS.EDUCATION, list);
    return newItem;
  },

  update: async (id, data) => {
    try {
      const clean = sanitizePayload(data);
      const res = await apiClient.put(`/education/${id}`, clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.EDUCATION, []);
        const updated = list.map((item) => (item.id === id || item._id === id ? norm : item));
        localStore.set(STORAGE_KEYS.EDUCATION, updated);
        return norm;
      }
    } catch (err) {
      console.warn('Education update fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.EDUCATION, []);
    const updated = list.map((item) => (item.id === id || item._id === id ? { ...item, ...data } : item));
    localStore.set(STORAGE_KEYS.EDUCATION, updated);
    return data;
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/education/${id}`);
    } catch (err) {
      console.warn('Education delete fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.EDUCATION, []);
    const filtered = list.filter((item) => item.id !== id && item._id !== id);
    localStore.set(STORAGE_KEYS.EDUCATION, filtered);
    return true;
  }
};

/* ================= ACHIEVEMENTS SERVICE ================= */
export const achievementService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/achievements');
      if (Array.isArray(res.data)) {
        const norm = normalizeList(res.data);
        localStore.set(STORAGE_KEYS.ACHIEVEMENTS, norm);
        return norm;
      }
    } catch (err) {
      console.warn('Achievements fetch fallback:', err.message);
    }
    const ach = localStore.get(STORAGE_KEYS.ACHIEVEMENTS, []);
    return normalizeList(ach).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  create: async (data) => {
    try {
      const clean = sanitizePayload(data);
      const res = await apiClient.post('/achievements', clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.ACHIEVEMENTS, []);
        list.push(norm);
        localStore.set(STORAGE_KEYS.ACHIEVEMENTS, list);
        return norm;
      }
    } catch (err) {
      console.warn('Achievement create fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.ACHIEVEMENTS, []);
    const newItem = {
      ...data,
      id: data.id || uid('ach'),
      order: list.length + 1
    };
    list.push(newItem);
    localStore.set(STORAGE_KEYS.ACHIEVEMENTS, list);
    return newItem;
  },

  update: async (id, data) => {
    try {
      const clean = sanitizePayload(data);
      const res = await apiClient.put(`/achievements/${id}`, clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.ACHIEVEMENTS, []);
        const updated = list.map((item) => (item.id === id || item._id === id ? norm : item));
        localStore.set(STORAGE_KEYS.ACHIEVEMENTS, updated);
        return norm;
      }
    } catch (err) {
      console.warn('Achievement update fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.ACHIEVEMENTS, []);
    const updated = list.map((item) => (item.id === id || item._id === id ? { ...item, ...data } : item));
    localStore.set(STORAGE_KEYS.ACHIEVEMENTS, updated);
    return data;
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/achievements/${id}`);
    } catch (err) {
      console.warn('Achievement delete fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.ACHIEVEMENTS, []);
    const filtered = list.filter((item) => item.id !== id && item._id !== id);
    localStore.set(STORAGE_KEYS.ACHIEVEMENTS, filtered);
    return true;
  }
};

/* ================= MESSAGES INBOX SERVICE ================= */
export const messageService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/messages');
      if (Array.isArray(res.data)) {
        const norm = normalizeList(res.data);
        localStore.set(STORAGE_KEYS.MESSAGES, norm);
        return norm;
      }
    } catch (err) {
      console.warn('Messages fetch fallback:', err.message);
    }
    const msgs = localStore.get(STORAGE_KEYS.MESSAGES, []);
    return normalizeList(msgs).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  submit: async (data) => {
    try {
      const clean = sanitizePayload(data);
      const res = await apiClient.post('/messages', clean);
      if (res.data) {
        const norm = normalizeItem(res.data);
        const list = localStore.get(STORAGE_KEYS.MESSAGES, []);
        list.unshift(norm);
        localStore.set(STORAGE_KEYS.MESSAGES, list);
        return norm;
      }
    } catch (err) {
      console.warn('Message submit fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.MESSAGES, []);
    const newMsg = {
      ...data,
      id: uid('msg'),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(newMsg);
    localStore.set(STORAGE_KEYS.MESSAGES, list);
    return newMsg;
  },

  markRead: async (id, isRead = true) => {
    try {
      await apiClient.patch(`/messages/${id}/read`, { isRead });
    } catch (err) {
      console.warn('Message markRead fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.MESSAGES, []);
    const updated = list.map((item) => (item.id === id || item._id === id ? { ...item, isRead } : item));
    localStore.set(STORAGE_KEYS.MESSAGES, updated);
    return true;
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/messages/${id}`);
    } catch (err) {
      console.warn('Message delete fallback:', err.message);
    }
    const list = localStore.get(STORAGE_KEYS.MESSAGES, []);
    const filtered = list.filter((item) => item.id !== id && item._id !== id);
    localStore.set(STORAGE_KEYS.MESSAGES, filtered);
    return true;
  }
};
