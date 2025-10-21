import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Container, Button, Row, Col, Modal, Spinner } from "react-bootstrap";
import { CustomNavbar } from "../components/CustomNavbar";
import {
  FaUsers,
  FaUser,
  FaBuilding,
  FaEye,
  FaDownload,
  FaStickyNote,
  FaTools,
  FaIdBadge,
  FaSignInAlt,
  FaSignOutAlt,
  FaHourglassHalf,
  FaHardHat,
  FaCheckCircle,
  FaMicrochip,
  FaBolt,
  FaArrowLeft,
} from "react-icons/fa";
import { useGetLogsByUser } from "../api/hooks/useAccessLogs";
import { formatSecondsToHHMMSS, getDateAndDayFromTimestamp } from "../utils/formatDate";

export function UserAccessDetails() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const companyId = localStorage.getItem("bzg_companyId");
  const role = localStorage.getItem("bzg_role");
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const { data: userLogs, isLoading, isError } = useGetLogsByUser(userId);

  const handleDownloadClick = (range) => {
    alert(`Descargando registros: ${range}`);
    setShowDownloadModal(false);
  };

  return (
    <div className="g-background">
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

        <h2 className="text-white mb-3">Historial de accesos del usuario #{userId}</h2>
        <p className="text-light mb-4">
          Lista completa de accesos registrados para este usuario.
        </p>

        {/* Loader */}
        {isLoading && (
          <div className="text-center text-light">
            <Spinner animation="border" variant="light" />
            <p className="mt-2">Cargando registros...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center text-danger">
            <p>Error al cargar los registros. Inténtalo nuevamente.</p>
          </div>
        )}

        {/* Tabla de logs */}
        {!isLoading && !isError && (
          <Table striped bordered hover variant="dark" className="rounded shadow">
            <thead>
              <tr>
                <th><FaUser className="me-1" />Usuario</th>
                <th><FaMicrochip className="me-1" /> Dispositivo</th>
                {role === "SA" && (
                  <th><FaBuilding className="me-1" /> Empresa</th>
                )}<th><FaBolt className="me-1" /> Evento</th>
                <th><FaSignInAlt className="me-1 text-success" /> Entrada</th>
                <th><FaSignOutAlt className="me-1 text-danger" /> Salida</th>
                <th><FaHourglassHalf className="me-1" /> Duración</th>
                <th><FaHardHat className="me-1 text-warning" /> EPP</th>
                <th><FaCheckCircle className="me-1 text-success" /> Éxito</th>
                <th><FaStickyNote className="me-1" /> Observación</th>
              </tr>
            </thead>
            <tbody>
              {userLogs && userLogs.length > 0 ? (
                userLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.user?.name || "Desconocido"}</td>
                    <td>{log.device?.name || "N/A"}</td>
                    {role === "SA" && (
                      <td>{log.company?.name || "—"}</td>
                    )}
                    <td>{log.eventType?.name || "—"}</td>
                    <td>{log.entryTime ? getDateAndDayFromTimestamp(log.entryTime) : "—"}</td>
                    <td>{log.exitTime ? getDateAndDayFromTimestamp(log.exitTime) : "—"}</td>
                    <td>{log.durationSeconds ? formatSecondsToHHMMSS(log.durationSeconds) : "—"}</td>            <td className={log.correctEpp ? "text-success" : "text-danger"}>
                      {log.correctEpp ? "Sí" : "No"}
                    </td>
                    <td className={log.success ? "text-success" : "text-danger"}>
                      {log.success ? "✔" : "✖"}
                    </td>
                    <td>{log.observation || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No hay registros disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        <div className="d-flex justify-content-end mt-3">
          <Button variant="light" onClick={() => setShowDownloadModal(true)}>
            Descargar registros en Excel
          </Button>
        </div>
      </Container>

      {/* Modal de descarga */}
      <Modal
        show={showDownloadModal}
        onHide={() => setShowDownloadModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>Seleccionar rango de descarga</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Row className="text-center">
            {["Semanal", "Mensual", "Anual", "Todos"].map((label) => (
              <Col xs={6} className="mb-3" key={label}>
                <Button
                  variant="outline-light"
                  className="w-100 p-4"
                  style={{ borderRadius: "0.5rem" }}
                  onClick={() => handleDownloadClick(label)}
                >
                  {label}
                </Button>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}
