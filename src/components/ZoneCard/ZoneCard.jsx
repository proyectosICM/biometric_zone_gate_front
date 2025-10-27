import { useNavigate } from "react-router-dom";
import "./ZoneCard.css";
import { FaDoorOpen, FaMapMarkerAlt, FaUser } from "react-icons/fa";

export function ZoneCard({ zoneId, zoneName, countToday, recentAccesses, accessList }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/zona-ingresos/${zoneId}`);
  };

  return (
    <div className="zone-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <h2><FaMapMarkerAlt className="me-2 text-primary" />{zoneName}</h2>
      <p><FaDoorOpen className="me-2 text-success" />Accesos totales en el dia: {countToday}</p>
      <p><FaDoorOpen className="me-2 text-success" />Lista de 4 accesos mas recientes: {recentAccesses}</p>
      <ul>
        {accessList.map((a) => (
          <li key={a.id}>
            <FaUser className="me-2 text-light" />
            {a.user} – {a.time}
          </li>
        ))}
      </ul> 
    </div>
  );
}
