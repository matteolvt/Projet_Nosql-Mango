// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, register as apiRegister, getMe } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // 🔄 Récupération du profil si token présent
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const me = await getMe(token);
        setUser(me);
      } catch (err) {
        console.error("Erreur AuthContext getMe:", err);
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  // 🟢 Connexion
  const login = async (credentials) => {
    const { user: loggedUser, token: newToken } = await apiLogin(credentials);
    setUser(loggedUser);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    return loggedUser;
  };

  // 🟢 Inscription
  const register = async (data) => {
    const createdUser = await apiRegister(data);
    // après inscription → connexion auto
    const { user: loggedUser, token: newToken } = await apiLogin({
      email: data.email,
      password: data.password,
    });
    setUser(loggedUser);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    return loggedUser;
  };

  // 🔴 Déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
