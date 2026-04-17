import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { id, email, full_name }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate from cookie on mount
    let active = true;
    const init = async () => {
      const t = authApi.getToken();
      if (!t) {
        if (active) setLoading(false);
        return;
      }

      try {
        // Decode payload (no verify — server validates on each request)
        const payload = JSON.parse(atob(t.split('.')[1]));
        if (payload.exp * 1000 <= Date.now()) {
          authApi.logout();
          if (active) setLoading(false);
          return;
        }
        if (active) setToken(t);
        const me = await authApi.me();
        if (active) setUser(me);
      } catch {
        authApi.logout();
        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    init();
    return () => { active = false; };
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    setToken(data.access_token);
    const me = await authApi.me();
    setUser(me);
    return data;
  };

  const register = async (credentials) => {
    return await authApi.register(credentials);
  };

  const logout = () => {
    authApi.logout();
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const me = await authApi.updateMe(payload);
    setUser(me);
    return me;
  };

  const deleteAccount = async () => {
    await authApi.deleteMe();
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
