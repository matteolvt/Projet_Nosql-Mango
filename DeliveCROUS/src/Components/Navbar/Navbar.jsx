import { useLocation, useNavigate, Link } from "react-router-dom";
import cartIcon from "../../assets/images/carte-de-shopping.png";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { count } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        {/* === Gauche === */}
        <div className="left">
          {location.pathname !== "/" && (
            <button
              id="return"
              className="return button arrow-button arrow-left"
              aria-label="Retour"
              onClick={() => navigate(-1)}
            ></button>
          )}
        </div>

        {/* === Centre === */}
        <h1 className="titre">
          <Link to="/" className="brand-link">
            DeliveCROUS
          </Link>
        </h1>

        {/* === Droite === */}
        <div className="right">
          {user ? (
            <>
              {/* 👑 Badge visible uniquement si admin */}
              {user.role === "admin" && (
                <Link to="/admin" className="adminBadge">
                  👑 Admin
                </Link>
              )}

              {/* 👤 Mon compte visible seulement pour les étudiants */}
              {user.role === "student" && (
                <Link to="/me" className="navLinkButton">
                  Mon compte
                </Link>
              )}

              <span className="welcome">
                Bienvenue{" "}
                {user.prenom ? `${user.prenom}` : user.name || user.email}
              </span>

              <button className="navButton" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="navLinkButton">
                Register
              </Link>
              <Link to="/login" className="navLinkButton">
                Login
              </Link>
            </>
          )}

          {/* 🛒 Panier */}
          <Link to="/cart" className="cartButton" aria-label="Panier">
            <img src={cartIcon} alt="Panier" />
            {count > 0 && <span className="cartBadge">{count}</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}
