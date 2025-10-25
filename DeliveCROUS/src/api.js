// src/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* ===========================
    AUTH
=========================== */

export const login = async (credentials) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur de connexion");
  return data; // { user, token }
};

export const register = async (userData) => {
  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      nom: userData.name,
      prenom: userData.prenom,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur d'inscription");
  return data;
};

export const getMe = async (token) => {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Impossible de récupérer le profil");
  return data;
};

/* ===========================
    USERS (admin)
=========================== */

export const getUsers = async (token) => {
  const res = await fetch(`${API_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors du chargement des utilisateurs");
  return data;
};

export const getUserById = async (id, token) => {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors du chargement de l'utilisateur");
  return data;
};

/* ===========================
    PLATS
=========================== */

export const getPlats = async () => {
  const res = await fetch(`${API_URL}/api/plats`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors du chargement des plats");
  return data;
};

export const getPlatById = async (id) => {
  const res = await fetch(`${API_URL}/api/plats/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors du chargement du plat");
  return data;
};

export const createPlat = async (platData, token) => {
  const res = await fetch(`${API_URL}/api/plats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(platData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de la création du plat");
  return data;
};

export const updatePlat = async (id, data, token) => {
  const res = await fetch(`${API_URL}/api/plats/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Erreur lors de la modification du plat");
  return result;
};

export const deletePlat = async (id, token) => {
  const res = await fetch(`${API_URL}/api/plats/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression du plat");
  return data;
};

/* ===========================
    COMMANDES
=========================== */

export const createCommande = async (commandeData, token) => {
  const res = await fetch(`${API_URL}/api/commandes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commandeData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de la création de la commande");
  return data;
};

export const getMyCommandes = async (token) => {
  const res = await fetch(`${API_URL}/api/commandes/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors du chargement des commandes");
  return data;
};

export const getAllCommandes = async (token) => {
  const res = await fetch(`${API_URL}/api/commandes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors du chargement des commandes");
  return data;
};

export const getCommandeById = async (id, token) => {
  const res = await fetch(`${API_URL}/api/commandes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors du chargement de la commande");
  return data;
};

export const updateCommande = async (id, data, token) => {
  const res = await fetch(`${API_URL}/api/commandes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Erreur lors de la modification de la commande");
  return result;
};

/* ===========================
    ADMIN
=========================== */

export const getAdminStats = async (token) => {
  const res = await fetch(`${API_URL}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors du chargement des statistiques");
  return data;
};

/* ===========================
    ADMIN ACTIONS
=========================== */

// Supprimer un utilisateur
export const deleteUser = async (id, token) => {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression de l'utilisateur");
  return data;
};

export const deleteCommande = async (id, token) => {
  const res = await fetch(`${API_URL}/api/commandes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression de la commande");
  return data;
};

export const updateCommandeStatut = async (id, statut, token) => {
  const res = await fetch(`${API_URL}/api/commandes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ statut }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de la mise à jour du statut");
  return data;
};
