import "./Confirm.css";
import { useNavigate } from "react-router-dom";

export default function ConfirmActions({
  primaryLabel = "Retour à l’accueil",
  onPrimary,
}) {
  const navigate = useNavigate();
  const handleClick = () => (onPrimary ? onPrimary() : navigate("/"));
  return (
    <div className="confirm-actions">
      <button className="confirm-btn" onClick={handleClick}>
        {primaryLabel}
      </button>
    </div>
  );
}
