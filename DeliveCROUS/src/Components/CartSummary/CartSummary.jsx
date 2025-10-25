import './CartSummary.css';

export default function CartSummary({ total, onClear, onCheckout }) {
  return (
    <div className="cart-summary">
      <div className="cart-total">
        Total : <strong>{total.toFixed(2)} €</strong>
      </div>
      <div className="cart-buttons">
        <button className="cart-clear" onClick={onClear}>Vider le panier</button>
        <button className="cart-checkout" onClick={onCheckout}>Passer au paiement</button>
      </div>
    </div>
  );
}
