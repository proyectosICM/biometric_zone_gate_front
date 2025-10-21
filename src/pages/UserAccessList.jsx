import React, { useState } from "react";
import {
  Table,
  Container,
  Button,
  Modal,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CustomNavbar } from "../components/CustomNavbar";
import Swal from "sweetalert2";

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
} from "react-icons/fa";

import { useGetUsersByCompanyIdPaged } from "../api/hooks/useUser";
import { useGetLogsByCompanyPaginated } from "../api/hooks/useAccessLogs";
import { formatSecondsToHHMMSS, getDateAndDayFromTimestamp } from "../utils/formatDate";

export function UserAccessList() {
  const companyId = localStorage.getItem("bzg_companyId");
  const role = localStorage.getItem("bzg_role");
  const navigate = useNavigate();

  // Paginación de usuarios 
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Paginación de logs
  const [logPage, setLogPage] = useState(0);
  const [logSize] = useState(10);

  // Modal descarga
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Fetch usuarios
  const { data, isLoading, isError } = useGetUsersByCompanyIdPaged(
    companyId,
    page,
    size,
    "id",
    "asc"
  );

  // Fetch logs
  const {
    data: logsData,
    isLoading: isLoadingLogs,
    isError: isErrorLogs,
  } = useGetLogsByCompanyPaginated(
    companyId,
    logPage,
    logSize,
    "createdAt",
    "desc"
  );

  const users = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const companyLogs = logsData?.content || [];
  const totalLogPages = logsData?.totalPages || 1;

  const handleViewClick = (userId) => navigate(`/user-access/${userId}`);

  const handleDownloadClick = (range) => {
    setShowDownloadModal(false);
    Swal.fire({
      icon: "info",
      title: "Descarga iniciada",
      text: `Descargando registros (${range}).`,
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#198754",
    });
  };

  // Loading / error
  if (isLoading)
    return (
      <div className="g-background min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <CustomNavbar />
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-3">Cargando usuarios...</p>
      </div>
    );

  if (isError)
    return (
      <div className="g-background min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <CustomNavbar />
        <p className="text-danger">Error al cargar usuarios.</p>
      </div>
    );

  console.log(companyLogs)
  return (
    <div className="g-background min-vh-100">
      <CustomNavbar />
      <Container className="py-4">
        <h2 className="text-white text-center mb-4">
          <FaUsers className="me-2" />
          Acceso de zonas por usuario
        </h2>

        <p className="text-center text-light mb-4">
          Selecciona un usuario para ver su historial de accesos.
        </p>

        {/* TABLA USUARIOS */}
        <div className="table-responsive rounded overflow-hidden shadow mb-5">
          <Table striped bordered hover variant="dark" className="align-middle mb-0">
            <thead className="table-dark text-center">
              <tr>
                <th><FaIdBadge className="me-1" />ID</th>
                <th><FaUser className="me-1" />Nombre</th>
                <th><FaUsers className="me-1 text-secondary" />Usuario</th>
                {role === "SA" && (
                  <th><FaBuilding className="me-1 text-warning" /> Empresa</th>
                )}
                <th><FaHardHat className="me-1 text-success" /> Rol</th>
                <th><FaTools className="me-1" />Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="text-center">
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.username || "Sin usuario web"}</td>
                    {role === "SA" && (
                      <td>{user.company?.name || "—"}</td>
                    )}
                    <td>{user.role}</td>
                    <td>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => handleViewClick(user.id)}
                      >
                        <FaEye className="me-2" />
                        Ver accesos
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === "SA" ? 6 : 5} className="text-center text-secondary py-4">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Paginación usuarios */}
        <div className="d-flex justify-content-between align-items-center text-light mb-5">
          <Button
            variant="outline-light"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </Button>
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <Button
            variant="outline-light"
            size="sm"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </Button>
        </div>

        {/* ACCESOS GENERALES */}
        <h3 className="text-white mb-3">
          <FaStickyNote className="me-2" />
          Accesos generales
        </h3>

        {isLoadingLogs ? (
          <div className="text-center text-light my-5">
            <Spinner animation="border" variant="light" />
            <p>Cargando accesos...</p>
          </div>
        ) : isErrorLogs ? (
          <div className="text-center text-danger my-4">
            Error al cargar los registros.
          </div>
        ) : (
          <>
            <div className="table-responsive rounded overflow-hidden shadow">
              <Table striped bordered hover variant="dark" className="align-middle mb-0">
                <thead className="table-dark text-center">
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
                  {companyLogs.length > 0 ? (
                    companyLogs.map((log) => (
                      <tr key={log.id} className="text-center">
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
                        <td>{log.observation || "—"}</td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-secondary py-4">
                        No hay registros disponibles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {/* Paginación accesos */}
            <div className="d-flex justify-content-between align-items-center text-light mt-3">
              <Button
                variant="outline-light"
                size="sm"
                disabled={logPage === 0}
                onClick={() => setLogPage((p) => p - 1)}
              >
                ← Anterior
              </Button>
              <span>
                Página {logPage + 1} de {totalLogPages}
              </span>
              <Button
                variant="outline-light"
                size="sm"
                disabled={logPage + 1 >= totalLogPages}
                onClick={() => setLogPage((p) => p + 1)}
              >
                Siguiente →
              </Button>
            </div>
          </>
        )}

        {/* BOTÓN DESCARGA 
        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setShowDownloadModal(true)}
          >
            <FaDownload className="me-2" />
            Descargar registro completo en Excel
          </Button>
        </div>*/}
      </Container>

      {/* MODAL DESCARGA */}
      <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>Seleccionar rango de descarga</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Row className="text-center">
            {["Semanal", "Mensual", "Anual", "Todos"].map((label) => (
              <Col xs={6} className="mb-3" key={label}>
                <Button
                  variant="outline-light"
                  className="w-100 p-3"
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
