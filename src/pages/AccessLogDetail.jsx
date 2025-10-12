import { Card, Row, Col, Button, Container, Table, Spinner, Alert } from "react-bootstrap";
import { CustomNavbar } from "../components/CustomNavbar";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useGetAccessLogById, useGetLogsByUser } from "../api/hooks/useAccessLogs";
import { formatSecondsToHHMMSS, getDateAndDayFromTimestamp } from "../utils/formatDate";

export function AccessLogDetail() {
  const { id } = useParams(); // id del log desde la URL
  const navigate = useNavigate();

  const { data: accessLog, isLoading, isError } = useGetAccessLogById(id);

  // Cargar accesos del mismo usuario si existe userId
  const userId = accessLog?.user?.id;
  const { data: userAccesses } = useGetLogsByUser(userId);

  if (isLoading) {
    return (
      <div className="g-background d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  if (isError || !accessLog) {
    return (
      <div className="g-background d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">Error al cargar el registro de acceso.</Alert>
      </div>
    );
  }

  // Función para formatear fechas
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString("es-PE") : "—";

  // Duración (en formato hh:mm:ss)
  const getDuration = (entry, exit) => {
    if (!entry || !exit) return "—";
    const diff = (new Date(exit) - new Date(entry)) / 1000;
    const h = String(Math.floor(diff / 3600)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const s = String(Math.floor(diff % 60)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="g-background min-vh-100">
      <CustomNavbar />

      <Container className="mt-4">
        <Row className="mb-3">
          <Col>
            <Button
              variant="outline-light"
              className="w-100"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="me-2" />
              Atrás
            </Button>
          </Col>
        </Row>

        {/* --- Card principal --- */}
        <Card bg="dark" text="light" className="shadow-lg mb-4">
          <Card.Header className="text-center fs-4">Detalle del Acceso</Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <strong>ID:</strong> {accessLog.id}
              </Col>
              <Col md={6}>
                <strong>Usuario:</strong> {accessLog.user?.name || "—"}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <strong>Dispositivo:</strong> {accessLog.device?.name || "—"}
              </Col>
              <Col md={6}>
                <strong>Empresa:</strong> {accessLog.company?.name || "—"}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <strong>Evento:</strong> {accessLog.eventType?.name || "—"}
              </Col>
              <Col md={6}>
                <strong>Acción:</strong> {accessLog.action || "—"}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <strong>Entrada:</strong> {getDateAndDayFromTimestamp(accessLog.entryTime)}
              </Col>
              <Col md={6}>
                <strong>Salida:</strong> {getDateAndDayFromTimestamp(accessLog.exitTime)}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <strong>Duración:</strong> {formatSecondsToHHMMSS(accessLog.durationSeconds)}
              </Col>
              <Col md={6}>
                <strong>EPP Correcto:</strong>{" "}
                {accessLog.correctEpp ? "Sí" : "No"}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <strong>Éxito:</strong>{" "}
                {accessLog.success ? "✔" : "✖"}
              </Col>
              <Col md={6}>
                <strong>Observación:</strong>{" "}
                {accessLog.observation || "—"}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* --- Tabla de otros accesos --- */}
        {userAccesses?.length > 0 && (
          <Card bg="dark" text="light" className="shadow-lg">
            <Card.Header className="text-center fs-5">
              Otros accesos de este usuario
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover variant="dark" responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha Entrada</th>
                    <th>Fecha Salida</th>
                    <th>Duración</th>
                    <th>Evento</th>
                    <th>Acción</th>
                    <th>Dispositivo</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {userAccesses.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.id}</td>
                      <td>{entry.entryTime ? getDateAndDayFromTimestamp(entry.entryTime) : "—"}</td>
                      <td>{entry.exitTime ? getDateAndDayFromTimestamp(entry.exitTime) : "—"}</td>
                      <td>{entry.durationSeconds ? formatSecondsToHHMMSS(entry.durationSeconds) : "—"}</td>
                      <td>{entry.eventType?.name || "—"}</td>
                      <td>{entry.action || "—"}</td>
                      <td>{entry.device?.name || "—"}</td>
                      <td>{entry.success ? "✔" : "✖"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}
