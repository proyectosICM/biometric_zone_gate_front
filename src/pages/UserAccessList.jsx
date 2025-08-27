import React, { useState } from "react";
import { Table, Container, Button, Modal, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CustomNavbar } from "../components/CustomNavbar";

export function UserAccessList() {
  const navigate = useNavigate();
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const users = [
    { id: 1, name: "Ana Torres", username: "atorres", role: "ADMIN" },
    { id: 2, name: "Luis Ramos", username: "lramos", role: "USER" },
    { id: 3, name: "Carmen Díaz", username: "cdiaz", role: "USER" },
  ];

  const generalAccesses = [
    { id: 1, user: "Ana Torres", zone: "Zona A", time: "2025-07-18 09:00" },
    { id: 2, user: "Luis Ramos", zone: "Zona B", time: "2025-07-18 09:15" },
    { id: 3, user: "Carmen Díaz", zone: "Zona C", time: "2025-07-18 10:00" },
  ];

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
        <h2 className="text-white mb-2">Acceso de zonas por usuario</h2>
        <p className="text-light mb-4">Seleccione un usuario para ver sus ingresos a zonas.</p>

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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="light" size="sm" onClick={() => handleViewClick(user.id)}>
                    Ver acceso a zonas
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h3 className="text-white mt-5 mb-2">Accesos generales</h3>
        <p className="text-light mb-4">Registro general de todos los accesos recientes.</p>

        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Zona</th>
              <th>Fecha y hora</th>
            </tr>
          </thead>
          <tbody>
            {generalAccesses.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.user}</td>
                <td>{entry.zone}</td>
                <td>{entry.time}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-end mt-3">
          <Button variant="light" onClick={() => setShowDownloadModal(true)}>
            Descargar registro completo en Excel
          </Button>
        </div>
      </Container>

      {/* Modal de descarga */}
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
