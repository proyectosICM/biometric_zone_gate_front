import { useNavigate } from "react-router-dom";
import { CustomNavbar } from "../components/CustomNavbar";
import { ZoneCard } from "../components/ZoneCard/ZoneCard";
import "./Dashboard.css";

export function Dashboard() {
  const zones = [
    {
      id: 1,
      name: "Zona A - Laboratorio",
      recentCount: 3,
      accesses: [
        { id: 101, user: "Carlos R.", time: "10:25 AM" },
        { id: 102, user: "Lucía V.", time: "10:10 AM" },
        { id: 103, user: "Marcos T.", time: "9:45 AM" },
      ],
    },
    {
      id: 2,
      name: "Zona B - Almacén",
      recentCount: 2,
      accesses: [
        { id: 201, user: "Johana M.", time: "10:00 AM" },
        { id: 202, user: "Luis C.", time: "9:50 AM" },
      ],
    },
    {
      id: 3,
      name: "Zona C - Producción",
      recentCount: 4,
      accesses: [
        { id: 301, user: "Pedro A.", time: "10:30 AM" },
        { id: 302, user: "Ana P.", time: "10:25 AM" },
        { id: 303, user: "Erick J.", time: "10:20 AM" },
        { id: 304, user: "Sandra G.", time: "10:15 AM" },
      ],
    },
    {
      id: 4,
      name: "Zona D - Administración",
      recentCount: 1,
      accesses: [{ id: 401, user: "Martina R.", time: "9:30 AM" }],
    },
    {
      id: 4,
      name: "Zona D - Administración",
      recentCount: 1,
      accesses: [{ id: 401, user: "Martina R.", time: "9:30 AM" }],
    },
  ];

  return (
    <div className="g-background">
      <CustomNavbar />
      <div className="container-items">
        {zones.map((z) => (
          <ZoneCard key={z.id} zoneName={z.name} recentAccesses={z.recentCount} accessList={z.accesses} />
        ))}
      </div>
    </div>
  );
}
