import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('hexacarb_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authService.getMe();
      setUser(data.data);
    } catch {
      localStorage.removeItem('hexacarb_token');
      localStorage.removeItem('hexacarb_refresh');
      localStorage.removeItem('hexacarb_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const body = res.data;
    if (!body.data?.accessToken || !body.data?.refreshToken) {
      throw new Error('Invalid login response: missing tokens');
    }
    localStorage.setItem('hexacarb_token', body.data.accessToken);
    localStorage.setItem('hexacarb_refresh', body.data.refreshToken);
    localStorage.setItem('hexacarb_user', JSON.stringify(body.data.user));
    setUser(body.data.user);
    return body;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('hexacarb_token');
    localStorage.removeItem('hexacarb_refresh');
    localStorage.removeItem('hexacarb_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
