import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { CustomNavbar } from "../components/CustomNavbar";
import { Container, Table, Button, Stack, Row, Col } from "react-bootstrap";
import { FaFingerprint, FaArrowLeft } from "react-icons/fa";
import { Modal, Form } from "react-bootstrap";

export function ZoneAccessLog() {
  const { zoneId } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [newObservation, setNewObservation] = useState("");

  const handleOpenModal = (logId) => {
    setSelectedLogId(logId);
    setNewObservation("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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

  const [page, setPage] = useState(0);
  const totalPages = 5;
  const isLast = page >= totalPages - 1;

  const handlePrevious = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (!isLast) setPage(page + 1);
  };

  const handleConfigClick = () => {
    navigate(`/config-device/${zoneId}`);
  };

  const handleViewDetail = (logId) => {
    navigate(`/detalle-ingreso/${logId}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="g-background">
      <CustomNavbar />
      <h1 className="text-white text-center mt-4">Historial de accesos - Zona {zoneId}</h1>

      <Container className="mt-4">
        <Row className="mb-3">
          <Col md={6} className="mb-2">
            <Button variant="outline-light" className="w-100" onClick={handleBackClick}>
              <FaArrowLeft className="me-2" />
              Atrás
            </Button>
          </Col>
          <Col md={6}>
            <Button variant="outline-light" className="w-100" onClick={handleConfigClick}>
              <FaFingerprint className="me-2" />
              Configuración de biométrico
            </Button>
          </Col>
        </Row>

        <div className="table-responsive">
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
                      <Button variant="light" size="sm" onClick={() => handleOpenModal(log.id)}>
                        Ingresar observación
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleViewDetail(log.id)}>
                        Ver detalle
                      </Button>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

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

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>Agregar observación</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Form>
            <Form.Group controlId="formObservation">
              <Form.Label>Observación</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="bg-white text-dark border-0"
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                placeholder="Escribe la observación aquí..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button
            variant="light"
            size="sm"
            onClick={() => {
              console.log("Guardar para ID:", selectedLogId, "Observación:", newObservation);
              handleCloseModal();
            }}
          >
            Guardar observación
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
