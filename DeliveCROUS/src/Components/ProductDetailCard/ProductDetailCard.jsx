import './ProductDetailCard.css'

export default function ProductDetailCard({
  image,
  title,
  description,
  price,
  allergens = [],
  onAddToCart,
}) {
  return (
    <article className="pd-card">
      <div className="pd-media">
        <img src={image} alt={title} />
      </div>

      <div className="pd-body">
        <h1 className="pd-title">{title}</h1>

        <p className="pd-description">{description}</p>

        {allergens.length > 0 && (
          <section className="pd-section">
            <h2 className="pd-subtitle">Allergènes</h2>
            <ul className="pd-allergens">
              {allergens.map((a) => (
                <li key={a} className="pd-chip">{a}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="pd-cta">
          <span className="pd-price">{price} €</span>
          <button className="pd-add" onClick={onAddToCart}>
            Ajouter au panier
          </button>
        </div>
      </div>
    </article>
  )
}
