import { createContext, useContext, useEffect, useState } from "react";
import api from "../axios"; // 🔗 Axios configuré avec ton back Railway

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
        const res = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
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
    const res = await api.post("/api/auth/login", credentials);
    const { user: loggedUser, token: newToken } = res.data;
    setUser(loggedUser);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    return loggedUser;
  };

  // 🟢 Inscription
  const register = async (data) => {
    await api.post("/api/auth/register", data); // création du compte
    // connexion auto après inscription
    const res = await api.post("/api/auth/login", {
      email: data.email,
      password: data.password,
    });
    const { user: loggedUser, token: newToken } = res.data;
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
