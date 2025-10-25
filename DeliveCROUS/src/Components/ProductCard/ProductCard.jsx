import "./ProductCard.css";

export default function ProductCard({ image, title, description, price }) {
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <div className="product-content">
        <h3 className="product-title">{title}</h3>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          <span className="product-price">
            {parseFloat(price).toFixed(2)} €
          </span>
          <button className="add-button">Ajouter</button>
        </div>
      </div>
    </div>
  );
}
