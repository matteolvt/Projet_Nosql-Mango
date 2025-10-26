import Navbar from "../../Components/Navbar/Navbar";
import ConfirmHero from "../../Components/Confirmation/ConfirmHero";
import ConfirmInfo from "../../Components/Confirmation/ConfirmInfo";
import ConfirmActions from "../../Components/Confirmation/ConfirmActions";
import "../../Components/Confirmation/Confirm.css";
import { useLocation } from "react-router-dom";
import sucessImg from "../../assets/images/Confirmation.png";
import api from "../../axios"; // 🔗 on utilise l’instance Axios connectée à ton back

export default function Confirmation() {
  const { state } = useLocation();
  const address = state?.address;
  const balance = state?.balance;

  return (
    <div className="confirm-page">
      <Navbar />
      <main className="confirm-container">
        <ConfirmHero src={sucessImg} />
        <ConfirmInfo
          title="Commande envoyée !"
          subtitle="Elle vous attendra à la fin de votre cours !"
          address={address}
          balance={balance}
        />
        <ConfirmActions />
      </main>
    </div>
  );
}
