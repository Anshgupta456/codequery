import axios from 'axios';
import {
  initialProfile,
  initialProjects,
  initialProjectCategories,
  initialExperience,
  initialSkills,
  initialEducation,
  initialAchievements,
  initialMessages
} from './seedData';

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Use the origin of the current browser tab (e.g. http://192.168.x.x:5173 on mobile or http://localhost:5173 on desktop)
  // Both Vite (in dev) and Nginx (in prod) proxy /api to the backend, so all devices reach the real database seamlessly.
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api/v1`;
  }

  return 'http://localhost:5000/api/v1';
};

const BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token and ensure baseURL matches the device's connecting host
apiClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  const token = localStorage.getItem('portfolio_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

/* Local Storage Resilient Store Helper */
const STORAGE_KEYS = {
  PROFILE: 'portfolio_store_profile',
  PROJECTS: 'portfolio_store_projects',
  PROJECT_CATEGORIES: 'portfolio_store_project_categories',
  EXPERIENCE: 'portfolio_store_experience',
  SKILLS: 'portfolio_store_skills',
  EDUCATION: 'portfolio_store_education',
  ACHIEVEMENTS: 'portfolio_store_achievements',
  MESSAGES: 'portfolio_store_messages',
  AUTH: 'portfolio_store_auth'
};

export const initLocalStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialProfile));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECT_CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.PROJECT_CATEGORIES, JSON.stringify(initialProjectCategories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXPERIENCE)) {
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(initialExperience));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SKILLS)) {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(initialSkills));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EDUCATION)) {
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(initialEducation));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(initialAchievements));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialMessages));
  }
};

// Initialize right away
initLocalStore();

export const localStore = {
  get: (key, fallback) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  },
  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialProfile));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
    localStorage.setItem(STORAGE_KEYS.PROJECT_CATEGORIES, JSON.stringify(initialProjectCategories));
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(initialExperience));
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(initialSkills));
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(initialEducation));
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(initialAchievements));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialMessages));
  }
};

export { STORAGE_KEYS, apiClient };
export default apiClient;
