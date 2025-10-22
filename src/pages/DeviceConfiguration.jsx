import React, { useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { CustomNavbar } from "../components/CustomNavbar";
import { DeviceInfoCard } from "../components/DeviceInfoCard";
import { AllowedUsersCard } from "../components/AllowedUsersCard";
import { useGetDeviceById } from "../api/hooks/useDevice";
import { useGetByDeviceIdAndEnabledTrue } from "../api/hooks/useDeviceUserAccess";
 
export function DeviceConfiguration() {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  // Query: obtener datos del dispositivo
  const {
    data: deviceInfo,
    isLoading: isLoadingDevice,
    isError: isDeviceError,
  } = useGetDeviceById(deviceId);

  // Query: usuarios permitidos habilitados, paginados
  const page = 0;
  const size = 10;
  const {
    data: allowedUsersPage,
    isLoading: isLoadingUsers,
    isError: isUsersError,
  } = useGetByDeviceIdAndEnabledTrue(deviceId, page, size);

  // Si los datos se están cargando
  if (isLoadingDevice || isLoadingUsers) {
    return (
      <div className="text-center text-light py-5 g-background">
        <Spinner animation="border" variant="light" /> <br />
        <small>Cargando configuración del dispositivo...</small>
      </div>
    );
  }

  // Si ocurre un error
  if (isDeviceError || isUsersError) {
    return (
      <div className="text-center text-danger py-5 g-background">
        Error al cargar los datos del dispositivo o los usuarios permitidos.
      </div>
    );
  }

  // Si todo está correcto
  const allowedUsers = allowedUsersPage?.content || [];

  const handleEditUsers = () => {
    navigate(`/usuarios-permitidos/${deviceId}`);
  };

  return (
    <div className="g-background">
      <CustomNavbar />

      <Container className="mt-4">
        {/* Botón de volver */}
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

        {/* Información del dispositivo */}
        <DeviceInfoCard deviceId={deviceId} />

        {/* Lista de usuarios permitidos */}
        <AllowedUsersCard usersPage={allowedUsersPage} onEdit={handleEditUsers} />
      </Container>
    </div>
  );
}
