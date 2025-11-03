import { useEffect, useState, useRef, useCallback } from "react";
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
    let mounted = true;
    const fetchDevices = async () => {
      try {
        const allDevices = await deviceService.listByCompany(company);
        if (!mounted) return;
        const initialized = (allDevices || []).map((z) => ({ ...z, recentCount: 0 }));
        setZones(initialized);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDevices();
    return () => { mounted = false; };
  }, [company]);

  // ✅ Estabiliza identidad del callback
  const handleUpdateCount = useCallback((zoneId, count) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, recentCount: count } : z))
    );
  }, []);

  if (loading) {
    return (
      <div className="g-background d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  const threshold = 3;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // --- helpers SOLO para render ---
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 576 : false;

  // etiquetas cortas en móvil
  const chartData = zones.map((z) => {
    const name = z?.name || "Dispositivo";
    const short = isMobile && name.length > 12 ? name.slice(0, 12).trim() + "…" : name;
    return { name, short, ingresos: z.recentCount || 0 };
  });

  // ancho virtual para permitir scroll del gráfico en móvil
  const virtualWidthPx = Math.max(chartData.length * 120, 360);
  const chartHeight = isMobile ? 320 : 450;
  const chartMargin = isMobile
    ? { top: 16, right: 24, bottom: 24, left: 40 }
    : { top: 40, right: 100, bottom: 80, left: 100 };

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

        {/* En móvil: contenedor con scroll horizontal y ancho virtual */}
        <div className={isMobile ? "chart-scroll-wrapper" : ""}>
          <div
            className={isMobile ? "chart-scroll-inner" : ""}
            style={isMobile ? { width: virtualWidthPx, height: chartHeight } : {}}
          >
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={chartData} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={isMobile ? "short" : "name"}
                  angle={isMobile ? 0 : -30}
                  textAnchor={isMobile ? "middle" : "end"}
                  interval={0}
                  height={isMobile ? 30 : 60}
                  tick={{ fill: "#fff", fontSize: isMobile ? 11 : 12 }}
                />
                <YAxis tick={{ fill: "#fff" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#222", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                  labelFormatter={(label, payload) =>
                    (payload && payload[0] && payload[0].payload?.name) || label
                  }
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
          </div>
        </div>
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

  // ✅ Evita bucle: solo dispara si el valor cambió realmente
  const lastCountRef = useRef();
  useEffect(() => {
    if (!isLoadingCount && typeof countToday !== "undefined") {
      if (lastCountRef.current !== countToday) {
        onUpdateCount(zone.id, countToday);
        lastCountRef.current = countToday;
      }
    }
    // NO incluir onUpdateCount en deps para evitar loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingCount, countToday, zone.id]);

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
