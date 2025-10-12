import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { CustomNavbar } from "../components/CustomNavbar";
import { Container, Table, Button, Stack, Row, Col, Modal, Form } from "react-bootstrap";
import { FaFingerprint, FaArrowLeft } from "react-icons/fa";
import {
  FaIdBadge,
  FaUser,
  FaMicrochip,
  FaBuilding,
  FaBolt,
  FaExchangeAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaHourglassHalf,
  FaHardHat,
  FaCheckCircle,
  FaTimesCircle,
  FaStickyNote,
  FaTools,
} from "react-icons/fa"

import Swal from "sweetalert2";
import {
  useGetLogsByDevicePaginated,
  useUpdateObservation,
} from "../api/hooks/useAccessLogs.jsx";
import { formatDateTime, formatSecondsToHHMMSS, getDateAndDayFromTimestamp, getDateFromTimestamp } from "../utils/formatDate.jsx";

export function ZoneAccessLog() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const role = "SAS"

  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [newObservation, setNewObservation] = useState("");

  // Mutación para actualizar observación
  const { mutate: updateObservation, isLoading: isUpdating } = useUpdateObservation();

  const handleOpenModal = (logId, currentObservation = "") => {
    setSelectedLogId(logId);
    setNewObservation(currentObservation);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Paginación
  const [page, setPage] = useState(0);
  const size = 4;
  const direction = "desc";

  // Datos del backend
  const { data, isLoading, isError } = useGetLogsByDevicePaginated(deviceId, page, size, {
    sortBy: "createdAt",
    direction: "desc",
  });
  const accessLogs = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const isLast = page >= totalPages - 1;

  // Navegación
  const handlePrevious = () => page > 0 && setPage(page - 1);
  const handleNext = () => !isLast && setPage(page + 1);
  const handleBackClick = () => navigate(-1);
  const handleConfigClick = () => navigate(`/config-device/${deviceId}`);
  const handleViewDetail = (logId) => navigate(`/detalle-ingreso/${logId}`);

  // Guardar observación (envía al backend)
  const handleSaveObservation = () => {
    if (!newObservation.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Observación vacía",
        text: "Por favor escribe una observación antes de guardar.",
        background: "#1e1e1e",
        color: "#fff",
        confirmButtonColor: "#d33",
      });
      return;
    }

    updateObservation(
      { id: selectedLogId, observation: newObservation },
      {
        onSuccess: () => {
          handleCloseModal();
          Swal.fire({
            icon: "success",
            title: "Observación guardada",
            text: `Se actualizó correctamente la observación para el registro ${selectedLogId}.`,
            background: "#1e1e1e",
            color: "#fff",
            confirmButtonColor: "#198754",
          });
        },
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "Error al guardar",
            text: "No se pudo actualizar la observación. Inténtalo de nuevo.",
            background: "#1e1e1e",
            color: "#fff",
            confirmButtonColor: "#d33",
          });
        },
      }
    );
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="g-background min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <CustomNavbar />
        <div className="text-center text-light mt-5">
          <div className="spinner-border text-light mb-3" role="status"></div>
          <p>Cargando registros...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (isError) {
    return (
      <div className="g-background min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <CustomNavbar />
        <div className="text-center text-danger mt-5">
          <p>Error al cargar los registros de acceso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="g-background min-vh-100">
      <CustomNavbar />
      <Container className="py-4">
        <h2 className="text-center text-light mb-4">
          Historial de accesos - Zona {deviceId}
        </h2>

        {/* Botones superiores */}
        <Row className="mb-4">
          <Col md={6} className="mb-2">
            <Button variant="outline-light" className="w-100" onClick={handleBackClick}>
              <FaArrowLeft className="me-2" />
              Volver atrás
            </Button>
          </Col>
          <Col md={6}>
            <Button variant="outline-light" className="w-100" onClick={handleConfigClick}>
              <FaFingerprint className="me-2" />
              Configurar biométrico
            </Button>
          </Col>
        </Row>

        {/* Tabla de registros */}
        <div className="table-responsive rounded overflow-hidden shadow">
          <Table striped bordered hover variant="dark" className="align-middle mb-0">
            <thead className="table-dark text-center">
              <tr>
                <th><FaIdBadge className="me-1" /> ID</th>
                <th><FaUser className="me-1" /> Usuario</th>
                <th><FaMicrochip className="me-1" /> Dispositivo</th>
                {role === "SA" && (
                  <th><FaBuilding className="me-1" /> Empresa</th>
                )}
                <th><FaBolt className="me-1" /> Evento</th>
                {/* <th><FaExchangeAlt className="me-1" /> Acción</th> */}
                <th><FaSignInAlt className="me-1 text-success" /> Entrada</th>
                <th><FaSignOutAlt className="me-1 text-danger" /> Salida</th>
                <th><FaHourglassHalf className="me-1" /> Duración</th>
                <th><FaHardHat className="me-1 text-warning" /> EPP</th>
                <th><FaCheckCircle className="me-1 text-success" /> Éxito</th>
                <th><FaStickyNote className="me-1" /> Observación</th>
                <th><FaTools className="me-1" /> Acciones</th>
              </tr>
            </thead>
            <tbody>
              {accessLogs.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center text-secondary py-4">
                    No hay registros de acceso en esta zona.
                  </td>
                </tr>
              ) : (
                accessLogs.map((log) => (
                  <tr key={log.id} className="text-center">
                    <td>{log.id}</td>
                    <td>{log.user?.name || "—"}</td>
                    <td>{log.device?.name || "—"}</td>
                    {role === "SA" && (
                      <td>{log.company?.name || "—"}</td>
                    )}
                    {/*<td>{log.action}</td>*/}

                    <td>{log.eventType?.name || "—"}</td>
                    <td>{log.entryTime ? getDateAndDayFromTimestamp(log.entryTime) : "—"}</td>
                    <td>{log.exitTime ? getDateAndDayFromTimestamp(log.exitTime) : "—"}</td>
                    <td>{log.durationSeconds ? formatSecondsToHHMMSS(log.durationSeconds) : "—"}</td>
                    <td className={log.correctEpp ? "text-success" : "text-danger"}>
                      {log.correctEpp ? "Sí" : "No"}
                    </td>
                    <td className={log.success ? "text-success" : "text-danger"}>
                      {log.success ? "✔" : "✖"}
                    </td>
                    <td>{log.observation || "—"}</td>
                    <td>
                      <Stack gap={2}>
                        <Button
                          variant="outline-light"
                          size="sm"
                          onClick={() => handleOpenModal(log.id, log.observation)}
                        >
                          {log.observation ? "Editar" : "Añadir"} observación
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleViewDetail(log.id)}
                        >
                          Ver detalle
                        </Button>
                      </Stack>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Paginación */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button variant="outline-light" onClick={handlePrevious} disabled={page === 0}>
            ← Anterior
          </Button>
          <span className="text-light">
            Página {page + 1} de {totalPages}
          </span>
          <Button variant="outline-light" onClick={handleNext} disabled={isLast}>
            Siguiente →
          </Button>
        </div>
      </Container>

      {/* Modal de observación */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>
            {selectedLogId ? "Editar observación" : "Agregar observación"}
          </Modal.Title>
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
            variant="outline-light"
            size="sm"
            onClick={handleSaveObservation}
            disabled={isUpdating}
          >
            {isUpdating ? "Guardando..." : "Guardar observación"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
