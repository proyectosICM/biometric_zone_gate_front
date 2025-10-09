import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CustomNavbar } from "../components/CustomNavbar";
import { ZoneCard } from "../components/ZoneCard/ZoneCard";
import "./Dashboard.css";
import { Container, Spinner } from "react-bootstrap";
import * as deviceService from "../api/services/deviceService";

export function Dashboard() {
  const navigate = useNavigate();
  const company = 1; // normalmente vendrá del JWT o localStorage

  const [zones, setZones] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const allDevices = await deviceService.listByCompany(company);

        // Convertimos los devices en "zonas" para mostrarlos en el Dashboard
        const zonesData = allDevices.map((d) => ({
          id: d.id,
          name: d.name, // el nombre del dispositivo
          recentCount: Math.floor(Math.random() * 5), // dato de ejemplo para accesos
          accesses: [
            { id: 1, user: "Usuario A", time: "10:00 AM" },
            { id: 2, user: "Usuario B", time: "10:15 AM" },
          ], // datos de ejemplo
          device: d, // pasamos todo el device si luego quieres más info
        }));

        setZones(zonesData);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoadingDevices(false);
      }
    };

    fetchDevices();
  }, [company]);

  const chartData = zones.map((z) => ({
    name: z.name,
    ingresos: z.accesses.length,
  }));

  const threshold = 3;

  if (loadingDevices) {
    return (
      <div className="g-background d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <div className="g-background">
      <CustomNavbar />
      <div className="container-items">
        {zones.map((z) => (
          <ZoneCard
            key={z.id}
            zoneId={z.id}
            zoneName={z.name} // ahora cada card es un dispositivo real
            recentAccesses={z.recentCount}
            accessList={z.accesses}
            device={z.device}
          />
        ))}
      </div>

      <Container className="mt-4">
        <h2 className="text-white text-center mb-4">Resumen de ingresos por dispositivo</h2>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            data={chartData}
            margin={{ top: 40, right: 100, bottom: 80, left: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-30}
              textAnchor="end"
              interval={0}
              height={60}
              tick={{ fill: "#fff" }}
            />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const isHigh = payload.ingresos > threshold;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={isHigh ? "#e74c3c" : "#3498db"}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                );
              }}
              activeDot={({ cx, cy, payload }) => {
                const isHigh = payload.ingresos > threshold;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={7}
                    fill={isHigh ? "#e74c3c" : "#3498db"}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Container>
    </div>
  );
}
