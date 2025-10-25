import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPlats } from "../../api";

export default function Home() {
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlats()
      .then((data) => {
        setPlats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement plats :", err);
        setLoading(false);
      });
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
