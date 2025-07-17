import { useParams } from "react-router-dom";
import { useState } from "react";
import { CustomNavbar } from "../components/CustomNavbar";
import { Container, Table, Button, Stack } from "react-bootstrap";

export function ZoneAccessLog() {
  const { zoneId } = useParams();

  // Simulación de datos (más adelante reemplazar con backend paginado)
  const accessLogs = [
    {
      id: 1,
      name: "Carlos R.",
      zone: `Zona ${zoneId}`,
      datetime: "2025-07-17 10:25",
      authMode: "Huella",
      authorized: true,
      observation: "Ingreso autorizado.",
    },
    {
      id: 2,
      name: "Lucía V.",
      zone: `Zona ${zoneId}`,
      datetime: "2025-07-17 06:30",
      authMode: "Tarjeta",
      authorized: false,
      observation: "Ingreso fuera de horario.",
    },
    {
      id: 3,
      name: "Marcos T.",
      zone: `Zona ${zoneId}`,
      datetime: "2025-07-16 18:45",
      authMode: "Reconocimiento facial",
      authorized: true,
      observation: "Sin incidentes.",
    },
    {
      id: 4,
      name: "Sandra G.",
      zone: `Zona ${zoneId}`,
      datetime: "2025-07-15 22:10",
      authMode: "Huella",
      authorized: false,
      observation: "Observación manual: puerta forzada.",
    },
  ];

  // Estado de paginación
  const [page, setPage] = useState(0);
  const totalPages = 5; // luego esto vendrá del backend
  const isLast = page >= totalPages - 1;

  const handlePrevious = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (!isLast) setPage(page + 1);
  };

  return (
    <div className="g-background">
      <CustomNavbar />
      <h1 className="text-white text-center mt-4">
        Historial de accesos - Zona {zoneId}
      </h1>

      <Container className="mt-4 table-responsive">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Zona</th>
              <th>Fecha y hora</th>
              <th>Modo de autenticación</th>
              <th>Autorización</th>
              <th>Observación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {accessLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.name}</td>
                <td>{log.zone}</td>
                <td>{log.datetime}</td>
                <td>{log.authMode}</td>
                <td>{log.authorized ? "Autorizado" : "Denegado"}</td>
                <td>{log.observation}</td>
                <td>
                  <Stack gap={1} direction="vertical">
                    <Button variant="light" size="sm">
                      Ingresar observación
                    </Button>
                    <Button variant="secondary" size="sm">
                      Ver detalle
                    </Button>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-between mt-3">
          <Button variant="outline-light" onClick={handlePrevious} disabled={page === 0}>
            ← Anterior
          </Button>
          <span className="text-light align-self-center">
            Página {page + 1} de {totalPages}
          </span>
          <Button variant="outline-light" onClick={handleNext} disabled={isLast}>
            Siguiente →
          </Button>
        </div>
      </Container>
    </div>
  );
}
