import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CustomNavbar } from "../components/CustomNavbar";
import { ZoneCard } from "../components/ZoneCard/ZoneCard";
import "./Dashboard.css";
import { Container, Spinner } from "react-bootstrap";
import * as deviceService from "../api/services/deviceService";
import { countLogsByDeviceAndDay } from "../api/services/accessLogsService"; // función directa sin hooks

export function Dashboard() {
  const navigate = useNavigate();
  const company = 1;
  const today = new Date().toISOString().split("T")[0];

  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevicesAndCounts = async () => {
      try {
        const allDevices = await deviceService.listByCompany(company);

        // Obtenemos los conteos en paralelo
        const zonesWithCounts = await Promise.all(
          allDevices.map(async (d) => {
            const count = await countLogsByDeviceAndDay(d.id, today);
            return {
              id: d.id,
              name: d.name,
              device: d,
              recentCount: count,
              accesses: new Array(count).fill().map((_, i) => ({
                id: i + 1,
                user: `Usuario ${i + 1}`,
                time: "Hoy",
              })),
            };
          })
        );

        setZones(zonesWithCounts);
      } catch (error) {
        console.error("Error fetching devices or counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevicesAndCounts();
  }, [company, today]);

  const chartData = zones.map((z) => ({
    name: z.name,
    ingresos: z.recentCount,
  }));

  const threshold = 3;

  if (loading) {
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
            zoneName={z.name}
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
