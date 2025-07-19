import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Container, Button, Row, Col, Modal } from "react-bootstrap";
import { CustomNavbar } from "../components/CustomNavbar";
import { FaArrowLeft } from "react-icons/fa";

export function UserAccessDetails() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const userAccesses = [
    { id: 1, userId: "1", zone: "Zona A", time: "2025-07-17 08:30" },
    { id: 2, userId: "1", zone: "Zona B", time: "2025-07-17 10:00" },
    { id: 3, userId: "1", zone: "Zona A", time: "2025-07-18 09:15" },
    { id: 4, userId: "2", zone: "Zona C", time: "2025-07-18 11:00" },
    { id: 5, userId: "3", zone: "Zona D", time: "2025-07-18 14:20" },
  ];

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
            <Button variant="outline-light" className="w-100" onClick={() => navigate(-1)}>
              <FaArrowLeft className="me-2" />
              Atrás
            </Button>
          </Col>
        </Row>

        <h2 className="text-white mb-3">Historial completo de accesos</h2>
        <p className="text-light mb-4">Lista de accesos registrados de todos los usuarios.</p>

        <Table striped bordered hover variant="dark" className="rounded shadow">
          <thead>
            <tr>
              <th>ID Usuario</th>
              <th>Zona</th>
              <th>Fecha y hora</th>
            </tr>
          </thead>
          <tbody>
            {userAccesses.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.userId}</td>
                <td>{entry.zone}</td>
                <td>{entry.time}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-end mt-3">

            <Button variant="light" onClick={() => setShowDownloadModal(true)}>
              Descargar registros en Excel
            </Button>

        </div>
      </Container>

      {/* Modal de descarga */}
      <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar rango de descarga</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="text-center">
            {["Semanal", "Mensual", "Anual", "Todos"].map((label) => (
              <Col xs={6} className="mb-3" key={label}>
                <Button variant="outline-dark" className="w-100 p-4" style={{ borderRadius: "0.5rem" }} onClick={() => handleDownloadClick(label)}>
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
