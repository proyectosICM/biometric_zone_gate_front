import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CustomNavbar } from "../components/CustomNavbar";
import { ZoneCard } from "../components/ZoneCard/ZoneCard";
import "./Dashboard.css";
import { Container } from "react-bootstrap";

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
  ];

  const chartData = zones.map((z) => ({
    name: z.name,
    ingresos: z.accesses.length,
  }));

  const threshold = 3;
  //       <div className="container-items">
  return (
    <div className="g-background">
      <CustomNavbar />
      <div className="container-items">
        {zones.map((z) => (
          <ZoneCard key={z.id} zoneId={z.id} zoneName={z.name} recentAccesses={z.recentCount} accessList={z.accesses} />
        ))}
      </div>

      <Container className="mt-4">
        <h2 className="text-white text-center mb-4">Resumen de ingresos por zona</h2>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={chartData} margin={{ top: 40, right: 100, bottom: 80, left:100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={60} tick={{ fill: "#fff" }} />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const isHigh = payload.ingresos > threshold;
                return <circle cx={cx} cy={cy} r={5} fill={isHigh ? "#e74c3c" : "#3498db"} stroke="#fff" strokeWidth={1} />;
              }}
              activeDot={({ cx, cy, payload }) => {
                const isHigh = payload.ingresos > threshold;
                return <circle cx={cx} cy={cy} r={7} fill={isHigh ? "#e74c3c" : "#3498db"} stroke="#fff" strokeWidth={2} />;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Container>
    </div>
  );
}
