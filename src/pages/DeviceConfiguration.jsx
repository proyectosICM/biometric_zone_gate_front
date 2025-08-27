import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { CustomNavbar } from "../components/CustomNavbar";
import { DeviceInfoCard } from "../components/DeviceInfoCard";
import { AllowedUsersCard } from "../components/AllowedUsersCard";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export function DeviceConfiguration() {
  const [deviceInfo] = useState({
    devName: "Entrada Principal",
    serverHost: "192.168.1.100",
    serverPort: "8080",
    pushEnable: "yes",
    language: "es",
    volume: "7",
    antiPass: "no",
    sleepTime: "5",
    verifyMode: "fingerprint",
    adminPwd: {
      oldPwd: "admin123",
      newPwd: "nuevaClave456",
    },
  });

  const [allowedUsers] = useState([
    { id: 1, name: "Carlos R.", role: "Empleado", authMode: "Huella" },
    { id: 2, name: "Lucía V.", role: "Supervisor", authMode: "Facial" },
    { id: 3, name: "Marcos T.", role: "Seguridad", authMode: "Tarjeta" },
  ]);

  const navigate = useNavigate();
  const handleEditUsers = () => {
    navigate(`/usuarios-permitidos/1`);
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
        {/* Tarjeta de configuración */}
        <DeviceInfoCard deviceInfo={deviceInfo} onEdit={() => console.log("Editar configuración de biométrico")} />

        {/* Lista de usuarios permitidos */}
        <AllowedUsersCard users={allowedUsers} onEdit={handleEditUsers} />
      </Container>
    </div>
  );
}
