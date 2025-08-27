import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Container, Row, Col, Table, Modal, Form } from "react-bootstrap";
import { CustomNavbar } from "../components/CustomNavbar";
import { FaArrowLeft, FaPlus, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

export function AllowedUsersManager() {
  const { id } = useParams(); // zonaId
  const navigate = useNavigate();

  const allowedUsers = [
    { id: 1, name: "Carlos R.", role: "Empleado", authMode: "Huella" },
    { id: 2, name: "Lucía V.", role: "Supervisor", authMode: "Facial" },
    { id: 3, name: "Marcos T.", role: "Seguridad", authMode: "Tarjeta" },
  ];

  const allUsers = [
    { id: 101, name: "Ana Gómez" },
    { id: 102, name: "Pedro López" },
    { id: 103, name: "Valeria Méndez" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedAuthMode, setSelectedAuthMode] = useState("Huella");

  const handleDelete = (userId) => {
    const user = allowedUsers.find((u) => u.id === userId);

    Swal.fire({
      title: `¿Eliminar permiso?`,
      text: `Se revocará el acceso de ${user.name} a esta zona.`,
      icon: "warning",
      background: "#212529", // fondo oscuro
      color: "#fff",
      iconColor: "#ffc107", // amarillo como advertencia
      showCancelButton: true,
      confirmButtonColor: "#6c757d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Eliminar permiso de usuario ID:", userId);
        // Aquí va la llamada a la API real
        Swal.fire({
          title: "Eliminado",
          text: "El permiso fue eliminado correctamente.",
          icon: "success",
          background: "#212529",
          color: "#fff",
          confirmButtonColor: "#198754", // verde Bootstrap
        });
      }
    });
  };

  const handleAddUser = () => setShowModal(true);

  const handleConfirmAdd = () => {
    console.log("Asignar usuario:", selectedUserId, "con", selectedAuthMode, "en zona", id);
    // Llamar a API para asignar usuario
    setShowModal(false);

    Swal.fire({
      title: "Usuario asignado",
      text: "El usuario fue agregado correctamente a la zona.",
      icon: "success",
      background: "#212529",
      color: "#fff",
      confirmButtonColor: "#198754", // verde Bootstrap
    });

    setSelectedUserId("");
    setSelectedAuthMode("Huella");
  };

  return (
    <div className="g-background min-vh-100">
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

        <Card bg="dark" text="light" className="shadow-lg">
          <Card.Header className="text-center fs-4">Usuarios Permitidos - Zona {id}</Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-end mb-3">
              <Button variant="light" onClick={handleAddUser}>
                <FaPlus className="me-2" />
                Agregar usuario
              </Button>
            </div>

            <div className="table-responsive">
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Modo de autenticación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {allowedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.role}</td>
                      <td>{user.authMode}</td>
                      <td>
                        <Button variant="secondary" size="sm" onClick={() => handleDelete(user.id)}>
                          <FaTrashAlt className="me-1" />
                          Eliminar permiso
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* MODAL: Agregar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Asignar Usuario a Zona {id}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar usuario</Form.Label>
              <Form.Select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                <option value="">-- Selecciona un usuario --</option>
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Modo de autenticación</Form.Label>
              <Form.Select value={selectedAuthMode} onChange={(e) => setSelectedAuthMode(e.target.value)}>
                <option value="Huella">Huella</option>
                <option value="Facial">Facial</option>
                <option value="Tarjeta">Tarjeta</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-light">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="light" onClick={handleConfirmAdd} disabled={!selectedUserId}>
            Asignar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
