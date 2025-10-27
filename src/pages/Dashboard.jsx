import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomNavbar } from "../components/CustomNavbar";
import { ZoneCard } from "../components/ZoneCard/ZoneCard";
import "./Dashboard.css";
import { Container, Spinner, Button } from "react-bootstrap";
import * as deviceService from "../api/services/deviceService";
import { useGetLatestLogsByDeviceToday, useCountLogsByDeviceAndDay } from "../api/hooks/useAccessLogs";
import { getEntryExitTimeString } from "../utils/formatDate";
import { FaChartLine, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function Dashboard() {
  const navigate = useNavigate();
  const company = localStorage.getItem("bzg_companyId");

  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const allDevices = await deviceService.listByCompany(company);
        const initialized = allDevices.map((z) => ({ ...z, recentCount: 0 }));
        setZones(initialized);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [company]);

  const handleUpdateCount = (zoneId, count) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, recentCount: count } : z))
    );
  };

  if (loading) {
    return (
      <div className="g-background d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  const threshold = 3;

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="g-background">
      <CustomNavbar />

      <div className="device-scroll-wrapper">
        <Button
          variant="outline-light"
          className="scroll-btn left"
          onClick={scrollLeft}
        >
          <FaChevronLeft />
        </Button>

        <div className="container-items-horizontal" ref={scrollRef}>
          {zones.map((zone) => (
            <ZoneCardWrapper
              key={zone.id}
              zone={zone}
              onUpdateCount={handleUpdateCount}
            />
          ))}
        </div>

        <Button
          variant="outline-light"
          className="scroll-btn right"
          onClick={scrollRight}
        >
          <FaChevronRight />
        </Button>
      </div>

      {/* --- Gráfico resumen --- */}
      <Container className="mt-4">
        <h2 className="text-white text-center mb-4">
          <FaChartLine
            className="me-2 text-success"
            style={{ fontSize: "1.4rem" }}
          />
          Resumen de ingresos por dispositivo
        </h2>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            data={zones.map((z) => ({
              name: z.name,
              ingresos: z.recentCount || 0,
            }))}
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

/* ---- Subcomponente para cada tarjeta ---- */
function ZoneCardWrapper({ zone, onUpdateCount }) { 
  const todayLocal = new Date().toLocaleDateString("en-CA");

  const { data: latestLogs, isLoading } = useGetLatestLogsByDeviceToday(zone.id);

  const { data: countToday, isLoading: isLoadingCount } =
    useCountLogsByDeviceAndDay(zone.id, todayLocal);

  const accessList =
    latestLogs?.map((log) => ({
      id: log.id,
      user: log.user?.name || "Usuario desconocido",
      time: getEntryExitTimeString(log.entryTime, log.exitTime),
    })) || [];

  useEffect(() => {
    if (!isLoadingCount && countToday !== undefined) {
      onUpdateCount(zone.id, countToday);
    }
  }, [isLoadingCount, countToday]);

  return (
    <ZoneCard
      key={zone.id}
      zoneId={zone.id}
      zoneName={zone.name}
      countToday={countToday}
      recentAccesses={accessList.length}
      accessList={accessList}
      device={zone}
      loading={isLoading}
    />
  );
}
