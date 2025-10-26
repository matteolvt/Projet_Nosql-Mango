import "./Confirm.css";

export default function ConfirmInfo({ title, subtitle, address, balance }) {
  return (
    <div className="confirm-info">
      <h2 className="confirm-title">{title || "Commande envoyée !"}</h2>
      {subtitle && <p className="confirm-sub">{subtitle}</p>}

      {typeof balance === "number" && (
        <p className="confirm-muted">
          Solde CROUS restant : {balance.toFixed(2)} €
        </p>
      )}

      {address && (address.street || address.city || address.zip) && (
        <p className="confirm-muted">
          Livraison : {address.street}, {address.city} {address.zip}
        </p>
      )}
    </div>
  );
}
