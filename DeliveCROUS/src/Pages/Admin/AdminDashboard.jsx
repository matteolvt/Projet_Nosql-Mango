import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../Components/Navbar/Navbar";
import api from "../../axios"; // 🔗 on utilise l’instance Axios connectée à ton back
import "./AdminDashboard.css";
import {
  getUsers,
  getAllCommandes,
  getPlats,
  createPlat,
  deleteUser,
  deleteCommande,
  updateCommande,
  updatePlat,
  deletePlat,
} from "../../api";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [plats, setPlats] = useState([]);
  const [editingPlat, setEditingPlat] = useState(null);
  const [editingCommande, setEditingCommande] = useState(null);
  const [newPlat, setNewPlat] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie: "",
    allergenes: "",
    image: "", // ✅ Ajout du champ image ici
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, commandesData, platsData] = await Promise.all([
          getUsers(token),
          getAllCommandes(token),
          getPlats(),
        ]);
        setUsers(usersData);
        setCommandes(commandesData);
        setPlats(platsData);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données admin");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  /* 🔹 UTILISATEURS */
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id, token);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  /* 🔹 PLATS */
  const handleDeletePlat = async (id) => {
    if (!window.confirm("Supprimer ce plat ?")) return;
    try {
      await deletePlat(id, token);
      setPlats((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddPlat = async (e) => {
    e.preventDefault();
    try {
      const created = await createPlat(
        { ...newPlat, prix: parseFloat(newPlat.prix) },
        token
      );
      setPlats((prev) => [...prev, created]);
      setNewPlat({
        nom: "",
        description: "",
        prix: "",
        categorie: "",
        allergenes: "",
        image: "",
      });
      alert("Plat ajouté avec succès !");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditPlat = async (e) => {
    e.preventDefault();
    try {
      const updated = await updatePlat(editingPlat.id, editingPlat, token);
      setPlats((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingPlat(null);
      alert("Plat modifié !");
    } catch (err) {
      alert(err.message);
    }
  };

  /* 🔹 COMMANDES */
  const handleEditCommande = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateCommande(
        editingCommande.id,
        editingCommande,
        token
      );
      setCommandes((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setEditingCommande(null);
      alert("Commande mise à jour !");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCommande = async (id) => {
    if (!window.confirm("Supprimer cette commande ?")) return;
    try {
      await deleteCommande(id, token);
      setCommandes((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-page">
      <Navbar />
      <main className="admin-container">
        <h2>👑 Tableau de bord Admin</h2>

        {/* === UTILISATEURS === */}
        <section className="admin-section">
          <h3>Utilisateurs ({users.length})</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    {u.prenom} {u.nom}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {u.role !== "admin" && (
                      <button
                        className="danger-btn"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* === PLATS === */}
        <section className="admin-section">
          <h3>Plats ({plats.length})</h3>

          {/* ✅ Formulaire ajout plat avec champ image */}
          <form className="add-plat-form" onSubmit={handleAddPlat}>
            <input
              type="text"
              placeholder="Nom"
              value={newPlat.nom}
              onChange={(e) => setNewPlat({ ...newPlat, nom: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newPlat.description}
              onChange={(e) =>
                setNewPlat({ ...newPlat, description: e.target.value })
              }
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Prix"
              value={newPlat.prix}
              onChange={(e) => setNewPlat({ ...newPlat, prix: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Catégorie"
              value={newPlat.categorie}
              onChange={(e) =>
                setNewPlat({ ...newPlat, categorie: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Allergènes (optionnel)"
              value={newPlat.allergenes}
              onChange={(e) =>
                setNewPlat({ ...newPlat, allergenes: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="URL de l'image (optionnel)"
              value={newPlat.image}
              onChange={(e) =>
                setNewPlat({ ...newPlat, image: e.target.value })
              }
            />
            <button className="primary-btn" type="submit">
              ➕ Ajouter
            </button>
          </form>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prix</th>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plats.map((p) => (
                <tr key={p.id}>
                  <td>{p.nom}</td>
                  <td>{p.prix.toFixed(2)} €</td>
                  <td>{p.categorie}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => setEditingPlat(p)}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      className="danger-btn"
                      onClick={() => handleDeletePlat(p.id)}
                    >
                      🗑 Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingPlat && (
            <form className="edit-form" onSubmit={handleEditPlat}>
              <h4>Modifier le plat : {editingPlat.nom}</h4>
              <input
                type="text"
                value={editingPlat.nom}
                onChange={(e) =>
                  setEditingPlat({ ...editingPlat, nom: e.target.value })
                }
              />
              <input
                type="text"
                value={editingPlat.description}
                onChange={(e) =>
                  setEditingPlat({
                    ...editingPlat,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="number"
                step="0.01"
                value={editingPlat.prix}
                onChange={(e) =>
                  setEditingPlat({ ...editingPlat, prix: e.target.value })
                }
              />
              <input
                type="text"
                value={editingPlat.allergenes || ""}
                placeholder="Allergènes (optionnel)"
                onChange={(e) =>
                  setEditingPlat({ ...editingPlat, allergenes: e.target.value })
                }
              />
              <input
                type="text"
                value={editingPlat.image || ""}
                placeholder="URL image"
                onChange={(e) =>
                  setEditingPlat({ ...editingPlat, image: e.target.value })
                }
              />
              <button className="primary-btn" type="submit">
                ✅ Enregistrer
              </button>
              <button
                className="secondary-btn"
                onClick={() => setEditingPlat(null)}
              >
                Annuler
              </button>
            </form>
          )}
        </section>

        {/* === COMMANDES === */}
        <section className="admin-section">
          <h3>Commandes ({commandes.length})</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Livraison</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((c) => (
                <tr key={c.id}>
                  <td>
                    {c.user?.prenom} {c.user?.nom}
                  </td>
                  <td>{c.total.toFixed(2)} €</td>
                  <td>{c.statut}</td>
                  <td>{c.pointLivraison}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => setEditingCommande(c)}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      className="danger-btn"
                      onClick={() => handleDeleteCommande(c.id)}
                    >
                      🗑 Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingCommande && (
            <form className="edit-form" onSubmit={handleEditCommande}>
              <h4>Modifier commande {editingCommande.id}</h4>
              <label>Statut</label>
              <select
                value={editingCommande.statut}
                onChange={(e) =>
                  setEditingCommande({
                    ...editingCommande,
                    statut: e.target.value,
                  })
                }
              >
                <option value="en attente">en attente</option>
                <option value="en cours">en cours</option>
                <option value="livrée">livrée</option>
              </select>
              <label>Point de livraison</label>
              <input
                type="text"
                value={editingCommande.pointLivraison}
                onChange={(e) =>
                  setEditingCommande({
                    ...editingCommande,
                    pointLivraison: e.target.value,
                  })
                }
              />
              <button className="primary-btn" type="submit">
                ✅ Enregistrer
              </button>
              <button
                className="secondary-btn"
                onClick={() => setEditingCommande(null)}
              >
                Annuler
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
