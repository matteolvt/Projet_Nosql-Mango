import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMe } from "../../api";
import Navbar from "../../Components/Navbar/Navbar";
import "./Me.css";

export default function Me() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getMe(token);
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMe();
  }, [token]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Chargement...</p>;

  return (
    <div className="me-page">
      <Navbar />
      <main className="me-container">
        <h2>👤 Mon compte</h2>

        <div className="me-card">
          <p>
            <strong>Nom :</strong> {user.prenom} {user.nom}
          </p>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
          <p>
            <strong>Rôle :</strong> {user.role}
          </p>
          <p>
            <strong>Créé le :</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button className="logout-btn" onClick={logout}>
          🚪 Se déconnecter
        </button>

        <hr className="divider" />

        <h3 className="me-subtitle">🧾 Mes commandes</h3>

        {user.commandes && user.commandes.length > 0 ? (
          <div className="commandes-list">
            {user.commandes.map((cmd) => (
              <div key={cmd.id} className="commande-card">
                <div className="commande-header">
                  <span className="commande-id">
                    Commande #{cmd.id.slice(0, 6)}
                  </span>
                  <span
                    className={`commande-statut ${
                      cmd.statut?.replace(" ", "-") || "en-attente"
                    }`}
                  >
                    {cmd.statut || "en attente"}
                  </span>
                </div>

                <p className="commande-total">
                  💰 Total : {cmd.total?.toFixed(2)} €
                </p>
                <p className="commande-date">
                  📅 Passée le :{" "}
                  {new Date(cmd.createdAt).toLocaleDateString("fr-FR")}
                </p>

                <div className="plats-list">
                  {cmd.plats.map((p) => (
                    <div key={p.id} className="plat-item">
                      <img
                        src={p.plat?.image || "https://via.placeholder.com/80"}
                        alt={p.plat?.nom}
                        className="plat-image"
                      />
                      <div>
                        <p className="plat-nom">{p.plat?.nom}</p>
                        <p>
                          {p.quantite} × {p.prixUnitaire.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-commandes">Aucune commande pour le moment.</p>
        )}
      </main>
    </div>
  );
}
