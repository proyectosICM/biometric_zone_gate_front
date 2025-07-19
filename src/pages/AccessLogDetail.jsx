import { Card, Row, Col, Button, Container, Table } from "react-bootstrap";
import { CustomNavbar } from "../components/CustomNavbar";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export function AccessLogDetail({ onClose }) {
  const { zoneId } = useParams();
  const navigate = useNavigate();

  // Datos temporales
  const accessLog = {
    id: "123456",
    user: {
      name: "Eduardo Aguilar",
    },
    zone: {
      name: "Zona 7 - Principal",
    },
    timestamp: "2025-07-18T10:30:00Z",
    verificationType: "Huella dactilar",
    result: "Acceso concedido",
    deviceName: "Dispositivo A-23",
    deviceIp: "192.168.0.101",
    description: "Usuario autorizado por biometría. Acceso normal.",
  };

  // Accesos del mismo usuario a esta zona (ejemplo)
  const userAccesses = [
    {
      id: "123456",
      timestamp: "2025-07-18T10:30:00Z",
      verificationType: "Huella dactilar",
      result: "Acceso concedido",
      deviceName: "Dispositivo A-23",
    },
    {
      id: "123457",
      timestamp: "2025-07-17T09:10:00Z",
      verificationType: "Reconocimiento facial",
      result: "Acceso concedido",
      deviceName: "Dispositivo B-15",
    },
    {
      id: "123458",
      timestamp: "2025-07-15T14:45:00Z",
      verificationType: "Huella dactilar",
      result: "Acceso denegado",
      deviceName: "Dispositivo A-23",
    },
  ];

  return (
    <div className="g-background">
      <CustomNavbar />

      <Container className="mt-4">
        <Row className="mb-3">
          <Col>
            <Button variant="outline-light" className="w-100" onClick={() => navigate(-1)}>
              <FaArrowLeft className="me-2" />
              Atrás
            </Button>
          </Col>
        </Row>

        <Card bg="dark" text="light" className="shadow-lg mb-4">
          <Card.Header className="text-center fs-4">Detalle del Acceso</Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Nombre del usuario:</strong> {accessLog.user?.name || "—"}
              </Col>
              <Col md={6}>
                <strong>Zona:</strong> {accessLog.zone?.name || "—"}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <strong>ID del acceso:</strong> {accessLog.id}
              </Col>
              <Col md={6}>
                <strong>Fecha:</strong> {new Date(accessLog.timestamp).toLocaleString()}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Tipo de verificación:</strong> {accessLog.verificationType || "—"}
              </Col>
              <Col md={6}>
                <strong>Resultado:</strong> {accessLog.result || "—"}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Dispositivo:</strong> {accessLog.deviceName || "—"}
              </Col>
              <Col md={6}>
                <strong>IP del dispositivo:</strong> {accessLog.deviceIp || "—"}
              </Col>
            </Row>

            {accessLog.description && (
              <Row className="mb-3">
                <Col>
                  <strong>Descripción:</strong> {accessLog.description}
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>

        <Card bg="dark" text="light" className="shadow-lg">
          <Card.Header className="text-center fs-5">Otros accesos de este usuario a esta zona</Card.Header>
          <Card.Body>
            <Table striped bordered hover variant="dark" responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Tipo de verificación</th>
                  <th>Resultado</th>
                  <th>Dispositivo</th>
                </tr>
              </thead>
              <tbody>
                {userAccesses.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>{new Date(entry.timestamp).toLocaleString()}</td>
                    <td>{entry.verificationType}</td>
                    <td>{entry.result}</td>
                    <td>{entry.deviceName}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
