import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [graduate, setGraduate] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
      setGraduate(data.graduate);
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setGraduate(data.graduate);
    return data;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setGraduate(data.graduate);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setGraduate(null);
  };

  const updateGraduate = (updated) => {
    setGraduate(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        graduate,
        loading,
        login,
        register,
        logout,
        loadUser,
        updateGraduate,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
