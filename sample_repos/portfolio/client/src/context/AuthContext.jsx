import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/portfolioService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check existing stored auth on mount
    try {
      const storedToken = localStorage.getItem('portfolio_admin_token');
      const storedUser = authService.getCurrentAdmin();
      if (storedToken && storedUser) {
        setToken(storedToken);
        setAdmin(storedUser);
      }
    } catch (err) {
      console.error('Error hydrating auth state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const res = await authService.login(username, password);
      setToken(res.data.token);
      setAdmin(res.data.admin);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setAdmin(null);
  };

  const value = {
    admin,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
