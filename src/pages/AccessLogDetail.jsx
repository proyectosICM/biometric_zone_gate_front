import {
  Card,
  Row,
  Col,
  Button,
  Container,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import { CustomNavbar } from "../components/CustomNavbar";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaIdBadge,
  FaUser,
  FaMicrochip,
  FaBuilding,
  FaBolt,
  FaSignInAlt,
  FaSignOutAlt,
  FaHourglassHalf,
  FaCheckCircle,
  FaStickyNote,
} from "react-icons/fa";
import {
  formatSecondsToHHMMSS,
  getDateAndDayFromTimestamp,
} from "../utils/formatDate";
import {
  useGetAccessLogById,
  useGetLogsByUser,
} from "../api/hooks/useAccessLogs";

export function AccessLogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔐 Simulación del rol del usuario (reemplaza con tu hook o contexto real)
  const role = localStorage.getItem("role") || "USER";

  const { data: accessLog, isLoading, isError } = useGetAccessLogById(id);
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

  return (
    <div className="g-background min-vh-100">
      <CustomNavbar />

      <Container className="mt-4">
        {/* --- Botón Atrás --- */}
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
          <Card.Header className="text-center fs-4">
            Detalle del Acceso
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <FaIdBadge size={14} className="me-2 text-info" />
                <strong>ID:</strong> {accessLog.id}
              </Col>
              <Col md={6}>
                <FaUser size={14} className="me-2 text-info" />
                <strong>Usuario:</strong> {accessLog.user?.name || "—"}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FaMicrochip size={14} className="me-2 text-info" />
                <strong>Dispositivo:</strong> {accessLog.device?.name || "—"}
              </Col>

              {/* Solo mostrar Empresa si rol es SA */}
              {role === "SA" && (
                <Col md={6}>
                  <FaBuilding size={14} className="me-2 text-info" />
                  <strong>Empresa:</strong> {accessLog.company?.name || "—"}
                </Col>
              )}
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FaBolt size={14} className="me-2 text-info" />
                <strong>Evento:</strong> {accessLog.eventType?.name || "—"}
              </Col>
              <Col md={6}>
                <strong>Acción:</strong> {accessLog.action || "—"}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FaSignInAlt size={14} className="me-2 text-success" />
                <strong>Entrada:</strong>{" "}
                {getDateAndDayFromTimestamp(accessLog.entryTime)}
              </Col>
              <Col md={6}>
                <FaSignOutAlt size={14} className="me-2 text-danger" />
                <strong>Salida:</strong>{" "}
                {getDateAndDayFromTimestamp(accessLog.exitTime)}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FaHourglassHalf size={14} className="me-2 text-info" />
                <strong>Duración:</strong>{" "}
                {formatSecondsToHHMMSS(accessLog.durationSeconds)}
              </Col>
              <Col md={6}>
                <strong>EPP Correcto:</strong>{" "}
                {accessLog.correctEpp ? "Sí" : "No"}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FaCheckCircle size={14} className="me-2 text-success" />
                <strong>Éxito:</strong>{" "}
                {accessLog.success ? "✔" : "✖"}
              </Col>
              <Col md={6}>
                <FaStickyNote size={14} className="me-2 text-info" />
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
                <thead className="table-dark text-center">
                  <tr>
                    <th><FaIdBadge size={14} className="me-1" /> ID</th>
                    <th><FaSignInAlt size={14} className="me-1 text-success" /> Entrada</th>
                    <th><FaSignOutAlt size={14} className="me-1 text-danger" /> Salida</th>
                    <th><FaHourglassHalf size={14} className="me-1" /> Duración</th>
                    <th><FaBolt size={14} className="me-1" /> Evento</th>
                    <th><FaMicrochip size={14} className="me-1" /> Dispositivo</th>
                    <th><FaCheckCircle size={14} className="me-1 text-success" /> Éxito</th>
                  </tr>
                </thead>
                <tbody>
                  {userAccesses.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.id}</td>
                      <td>
                        {entry.entryTime
                          ? getDateAndDayFromTimestamp(entry.entryTime)
                          : "—"}
                      </td>
                      <td>
                        {entry.exitTime
                          ? getDateAndDayFromTimestamp(entry.exitTime)
                          : "—"}
                      </td>
                      <td>
                        {entry.durationSeconds
                          ? formatSecondsToHHMMSS(entry.durationSeconds)
                          : "—"}
                      </td>
                      <td>{entry.eventType?.name || "—"}</td>
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
