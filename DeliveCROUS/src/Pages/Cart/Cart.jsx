import Navbar from "../../components/Navbar/Navbar";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/CartItem/CartItem";
import CartSummary from "../../components/CartSummary/CartSummary";
import AddressForm from "../../components/AddressForm/AddressForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createCommande } from "../../api";
import "./Cart.css";

export default function Cart() {
  const { items, setQty, removeItem, clear, total } = useCart();
  const { token } = useAuth(); // 🔑 pour envoi sécurisé
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zip: "",
  });
  const navigate = useNavigate();

  const isAddressValid = () => {
    const { street, city, zip } = address;
    return street.trim() && city.trim() && /^\d{5}$/.test(zip.trim());
  };

  const handleCheckout = async () => {
    if (items.length === 0) return alert("Votre panier est vide.");
    if (!isAddressValid())
      return alert(
        "Merci de renseigner Rue, Ville et un code postal à 5 chiffres."
      );
    if (!token)
      return alert("Vous devez être connecté pour passer une commande.");

    try {
      // 🧱 Structure de données attendue par ton back
      const plats = items.map((item) => ({
        platId: item.id,
        quantite: item.qty,
        prixUnitaire: item.price,
      }));

      const pointLivraison = `${address.street}, ${address.city} ${address.zip}`;

      // 📨 Envoi vers ton back
      const commande = await createCommande({ pointLivraison, plats }, token);

      console.log("✅ Commande créée :", commande);

      clear(); // vide le panier local
      navigate("/confirmation", {
        state: { address, total, balance: 19.5 },
      });
    } catch (err) {
      console.error("❌ Erreur lors de la commande :", err);
      alert("Erreur lors de la création de la commande.");
    }
  };

  return (
    <div
      className="cart-page"
      style={{ background: "#ffffffff", minHeight: "100vh" }}
    >
      <Navbar />

      <main className="cart-container">
        <h2 className="cart-title">Votre panier</h2>

        {items.length === 0 ? (
          <p className="cart-empty">Votre panier est vide.</p>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  image={item.image}
                  title={item.title}
                  price={item.price}
                  qty={item.qty}
                  onQtyChange={setQty}
                  onRemove={removeItem}
                />
              ))}
            </ul>

            <AddressForm value={address} onChange={setAddress} />

            <CartSummary
              total={total}
              onClear={clear}
              onCheckout={handleCheckout}
            />
          </>
        )}
      </main>
    </div>
  );
}
