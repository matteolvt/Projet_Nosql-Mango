import './CartItem.css';

export default function CartItem({
  id,
  image,
  title,
  price,
  qty,
  onQtyChange,
  onRemove,
}) {
  const inc = () => onQtyChange(id, qty + 1);
  const dec = () => onQtyChange(id, Math.max(1, qty - 1));

  return (
    <li className="cart-item">
      <img className="cart-item_img" src={image} alt={title} />
      <div className="cart-item_info">
        <h3 className="cart-item_title">{title}</h3>

        <div className="cart-item_meta">
          <span className="cart-item_price">{Number(price).toFixed(2)} €</span>

          <div className="cart-item_qty" role="group" aria-label={`Quantité de ${title}`}>
            {qty === 1 ? (
              <button
                type="button"
                className="qty-btn danger"
                onClick={() => onRemove(id)}
                aria-label="Supprimer l'article"
                title="Supprimer"
              >
                🗑️
              </button>
            ) : (
              <button
                type="button"
                className="qty-btn"
                onClick={dec}
                aria-label="Diminuer la quantité"
                title="Diminuer"
              >
                −
              </button>
            )}

            <span className="qty-value" aria-live="polite">{qty}</span>

            <button
              type="button"
              className="qty-btn"
              onClick={inc}
              aria-label="Augmenter la quantité"
              title="Augmenter"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}