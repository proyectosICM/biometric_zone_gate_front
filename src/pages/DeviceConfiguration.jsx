import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Card,
  Stack,
  Badge,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { CustomNavbar } from "../components/CustomNavbar";
import { DeviceInfoCard } from "../components/DeviceInfoCard";
import { AllowedUsersCard } from "../components/AllowedUsersCard";
import { useGetDeviceById } from "../api/hooks/useDevice";
import { useGetByDeviceIdAndEnabledTrue } from "../api/hooks/useDeviceUserAccess";

// Versión MOBILE de la lista de usuarios permitidos (xs-sm)
function AllowedUsersMobile({ usersPage, onEdit, role }) {
  const users = usersPage?.content || [];
  const total = usersPage?.totalElements ?? users.length ?? 0;

  // Helpers para tratar de usar los mismos campos que tu tabla
  const getUserName = (u) =>
    u.user?.name ??
    u.user?.fullName ??
    u.userName ??
    u.fullName ??
    u.name ??
    u.username ??
    "—";

  // Aquí metemos enrollId como prioridad
  const getUserDocument = (u) =>
    u.user?.enrollId ??
    u.enrollId ??
    u.user?.documentNumber ??
    u.user?.dni ??
    u.documentNumber ??
    u.dni ??
    u.userDocument ??
    u.document ??
    u.doc ??
    "—";

  const getUserRole = (u) => u.user?.role ?? u.role ?? undefined;

  return (
    <Card
      bg="dark"
      text="light"
      className="mt-4 shadow-sm border-secondary"
    >
      <Card.Header className="d-flex justify-content-between align-items-center border-secondary">
        <div className="d-flex flex-column">
          <span className="text-uppercase text-secondary small fw-semibold">
            Usuarios permitidos
          </span>
          <span className="text-light fw-semibold">
            Total:{" "}
            <Badge bg="light" text="dark" pill>
              {total}
            </Badge>
          </span>
        </div>
        <Button variant="outline-light" size="sm" onClick={onEdit}>
          Gestionar
        </Button>
      </Card.Header>

      <Card.Body className="pb-3">
        {users.length === 0 ? (
          <div className="text-center text-secondary py-3">
            No hay usuarios permitidos configurados para este dispositivo.
          </div>
        ) : (
          <Stack gap={3} className="mt-2">
            {users.map((u) => {
              const name = getUserName(u);
              const document = getUserDocument(u);
              const userRole = getUserRole(u);

              return (
                <div
                  key={u.id}
                  className="border border-secondary rounded-3 p-3 bg-black bg-opacity-50"
                >
                  {/* Nombre + estado */}
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <div>
                      <div className="fw-semibold">{name}</div>

                      {/* ID de acceso solo visible para SA */}
                      {role === "SA" && (
                        <small className="text-secondary">
                          ID acceso: {u.id}
                        </small>
                      )}
                    </div>
                    <Badge
                      bg={u.enabled ? "success" : "danger"}
                      className="text-uppercase small"
                    >
                      {u.enabled ? "Habilitado" : "Deshabilitado"}
                    </Badge>
                  </div>

                  {/* Documento / EnrollId */}
                  <div className="mb-1">
                    <small className="text-secondary d-block">
                      Enroll ID
                    </small>
                    <small className="text-light">{document}</small>
                  </div>

                  {/* Campo extra opcional: rol, área, etc. */}
                  {userRole && (
                    <div className="mb-1">
                      <small className="text-secondary d-block">Rol</small>
                      <small className="text-light">{userRole}</small>
                    </div>
                  )}
                </div>
              );
            })}
          </Stack>
        )}
      </Card.Body>
    </Card>
  );
}

export function DeviceConfiguration() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("bzg_role");

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

  const handleEditUsers = () => {
    navigate(`/usuarios-permitidos/${deviceId}`);
  };

  return (
    <div className="g-background">
      <CustomNavbar />

      <Container className="mt-4 mb-4">
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

        {/* Lista de usuarios permitidos:
            - Desktop / tablet (md+): tu card/tablas original.
            - Mobile (xs-sm): versión tipo tarjetas. */}
        <div className="d-none d-md-block">
          <AllowedUsersCard
            usersPage={allowedUsersPage}
            onEdit={handleEditUsers}
          />
        </div>

        <div className="d-md-none">
          <AllowedUsersMobile
            usersPage={allowedUsersPage}
            onEdit={handleEditUsers}
            role={role}
          />
        </div>
      </Container>
    </div>
  );
}
