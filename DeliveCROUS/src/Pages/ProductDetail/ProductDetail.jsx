import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import ProductDetailCard from "../../Components/ProductDetailCard/ProductDetailCard";
import { getPlatById } from "../../api";
import { useCart } from "../../context/CartContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Récupération du plat depuis l'API ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getPlatById(id);
        setProduct(data);
      } catch (err) {
        console.error("Erreur chargement plat:", err);
        setError("Produit introuvable ou erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // --- États visuels ---
  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Produit introuvable</p>;

  // --- Conversion safe des allergènes ---
  const parsedAllergens = Array.isArray(product.allergenes)
    ? product.allergenes
    : typeof product.allergenes === "string" && product.allergenes.trim() !== ""
    ? product.allergenes.split(",").map((a) => a.trim())
    : [];

  // --- Ajout au panier ---
  const handleAdd = () => {
    addItem(
      {
        id: product.id,
        image: product.image,
        title: product.nom,
        price: Number(product.prix) || 0,
      },
      1
    );
  };

  return (
    <div className="product-detail-page">
      <Navbar />
      <main>
        <ProductDetailCard
          id={product.id}
          image={product.image}
          title={product.nom}
          description={product.description}
          price={product.prix}
          allergens={parsedAllergens}
          onAddToCart={handleAdd}
        />
      </main>
    </div>
  );
}
