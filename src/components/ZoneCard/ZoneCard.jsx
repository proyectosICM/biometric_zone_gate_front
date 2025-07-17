import { useNavigate } from "react-router-dom";
import "./ZoneCard.css";

export function ZoneCard({ zoneId, zoneName, recentAccesses, accessList }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/zona-ingresos/${zoneId}`);
  };

  return (
    <div className="zone-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <h2>{zoneName}</h2>
      <p>Accesos recientes: {recentAccesses}</p>
      <ul>
        {accessList.map((a) => (
          <li key={a.id}>
            {a.user} – {a.time}
          </li>
        ))}
      </ul>
    </div>
  );
}
