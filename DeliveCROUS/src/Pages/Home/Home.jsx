import "./Home.css";
import Navbar from "../../Components/Navbar/Navbar";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../axios"; // 🔗 on utilise l’instance Axios connectée à ton back

export default function Home() {
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlats = async () => {
      try {
        // 🔥 Appel direct à ton back Railway
        const res = await api.get("/api/plats");
        setPlats(res.data);
      } catch (err) {
        console.error("Erreur chargement plats :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlats();
  }, []);

  return (
    <div className="home">
      <Navbar />
      <main className="home-content">
        <h2 className="section-title">La carte</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : plats.length === 0 ? (
          <p>Aucun plat disponible</p>
        ) : (
          <div className="product-list">
            {plats.map((plat) => (
              <Link
                key={plat.id}
                to={`/product/${plat.id}`}
                className="product-link"
              >
                <ProductCard
                  image={plat.image || "https://via.placeholder.com/150"}
                  title={plat.nom}
                  description={plat.description}
                  price={plat.prix}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
