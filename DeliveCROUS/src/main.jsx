import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Home from "./Pages/Home/Home.jsx";
import ProductDetail from "./Pages/ProductDetail/ProductDetail.jsx";
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";
import Cart from "./Pages/Cart/Cart.jsx";
import Confirmation from "./Pages/Confirmation/Confirmation.jsx";
import Me from "./Pages/Me/Me.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

import ProtectedRoute from "./Components/Route/ProtectedRoute.jsx";
import AdminRoute from "./Components/Route/AdminRoute.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";

import "./index.css";

// Petite 404 minimaliste
function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2>404 — Page introuvable</h2>
      <p>La page demandée n'existe pas.</p>
      <a href="/">← Retour à l’accueil</a>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes protégées (utilisateur connecté) */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/confirmation"
              element={
                <ProtectedRoute>
                  <Confirmation />
                </ProtectedRoute>
              }
            />
            {/* ✅ Route protégée /me (profil utilisateur) */}
            <Route
              path="/me"
              element={
                <ProtectedRoute>
                  <Me />
                </ProtectedRoute>
              }
            />

            {/* Route Admin protégée */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
