import "./Confirm.css";

export default function ConfirmHero({ src, alt = "Confirmation" }) {
  return (
    <div className="confirm-hero">
      <img className="confirm-hero-img" src={src} alt={alt} />
    </div>
  );
}
