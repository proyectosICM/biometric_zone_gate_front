import React, { useState } from "react";
import { Table, Container, Button, Modal, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CustomNavbar } from "../components/CustomNavbar";
import { useGetUsersByCompanyIdPaged } from "../api/hooks/useUser";
import { useGetLogsByCompany } from "../api/hooks/useAccessLogs";

export function UserAccessList() {
  const companyId = localStorage.getItem("bzg_companyId");
  const role = localStorage.getItem("bzg_role");;
  const navigate = useNavigate();

  // Paginación de usuarios
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy] = useState("id");
  const [direction] = useState("asc");

  // Modal descarga
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const { data, isLoading, isError } = useGetUsersByCompanyIdPaged(
    companyId,
    page,
    size,
    sortBy,
    direction
  );

  const {
    data: companyLogs,
    isLoading: isLoadingLogs,
    isError: isErrorLogs,
  } = useGetLogsByCompany(companyId);

  const users = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const handleViewClick = (userId) => {
    navigate(`/user-access/${userId}`);
  };

  const handleDownloadClick = (range) => {
    alert(`Descargando registros: ${range}`);
    setShowDownloadModal(false);
  };

  return (
    <div className="g-background">
      <CustomNavbar />
      <Container className="mt-4">
        {/* SECCIÓN 1: USUARIOS */}
        <h2 className="text-white mb-2">Acceso de zonas por usuario</h2>
        <p className="text-light mb-4">
          Seleccione un usuario para ver sus ingresos a zonas.
        </p>

        {isLoading && (
          <div className="text-center text-light my-5">
            <Spinner animation="border" variant="light" />
            <p>Cargando usuarios...</p>
          </div>
        )}

        {isError && (
          <div className="text-center text-danger my-4">
            Error al cargar usuarios.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => handleViewClick(user.id)}
                        >
                          Ver acceso a zonas
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-light">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Controles de paginación */}
            <div className="d-flex justify-content-between align-items-center text-light">
              <Button
                variant="secondary"
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
                variant="secondary"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente →
              </Button>
            </div>
          </>
        )}

        {/* SECCIÓN 2: ACCESOS GENERALES */}
        <h3 className="text-white mt-5 mb-2">Accesos generales</h3>
        <p className="text-light mb-4">
          Registro general de todos los accesos recientes de usuarios de la empresa.
        </p>

        {isLoadingLogs && (
          <div className="text-center text-light my-5">
            <Spinner animation="border" variant="light" />
            <p>Cargando accesos...</p>
          </div>
        )}

        {isErrorLogs && (
          <div className="text-center text-danger my-4">
            Error al cargar los registros de accesos.
          </div>
        )}

        {!isLoadingLogs && !isErrorLogs && (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Zona / Dispositivo</th>
                <th>Acción</th>
                <th>Fecha y hora</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {companyLogs && companyLogs.length > 0 ? (
                companyLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.user?.name || "Desconocido"}</td>
                    <td>{log.device?.name || "N/A"}</td>
                    <td>{log.action}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>{log.observation || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-light">
                    No hay registros disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        <div className="d-flex justify-content-end mt-3">
          <Button variant="light" onClick={() => setShowDownloadModal(true)}>
            Descargar registro completo en Excel
          </Button>
        </div>
      </Container>

      {/* MODAL DESCARGA */}
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
