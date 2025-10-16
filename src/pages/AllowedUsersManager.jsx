import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Table,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { CustomNavbar } from "../components/CustomNavbar";
import { FaArrowLeft, FaPlus, FaTrashAlt, FaBroom } from "react-icons/fa"; // 🆕 FaBroom para limpiar todo
import Swal from "sweetalert2";

import { useGetUsersByCompanyId } from "../api/hooks/useUser";
import { useListByCompany } from "../api/hooks/useDevice";
import {
  useGetByDeviceId,
  useCreateDeviceUserAccess,
  useDeleteDeviceUserAccess,
  useCleanDeviceUsersBySn, // 🆕 importar hook de limpieza total
} from "../api/hooks/useDeviceUserAccess";

export function AllowedUsersManager() {
  const { id } = useParams(); // ID del dispositivo
  const companyId = localStorage.getItem("bzg_companyId");
  const navigate = useNavigate();

  // ---------- HOOKS ----------
  const { data: allUsers = [], isLoading: loadingUsers } =
    useGetUsersByCompanyId(companyId);
  const { data: allDevices = [], isLoading: loadingDevices } =
    useListByCompany(companyId);
  const { data: allowedUsers = [], isLoading: loadingAllowed } =
    useGetByDeviceId(id);

  const createAccessMutation = useCreateDeviceUserAccess();
  const deleteAccessMutation = useDeleteDeviceUserAccess();
  const cleanAllMutation = useCleanDeviceUsersBySn(); // 🆕 hook de limpieza total

  // ---------- ESTADO ----------
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [weekZone, setWeekZone] = useState(1);
  const [groupNumber, setGroupNumber] = useState(1);
  const [startTime, setStartTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [endTime, setEndTime] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .slice(0, 16)
  );
  const [enabled, setEnabled] = useState(true);

  // ---------- FUNCIONES ----------
  const handleDelete = (accessId) => {
    const selectedAccess = allowedUsers.find((u) => u.id === accessId);

    Swal.fire({
      title: `¿Eliminar permiso?`,
      text: `Se revocará el acceso de ${selectedAccess.userName || "usuario desconocido"} a este dispositivo.`,
      icon: "warning",
      background: "#212529",
      color: "#fff",
      iconColor: "#ffc107",
      showCancelButton: true,
      confirmButtonColor: "#6c757d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAccessMutation.mutate(accessId, {
          onSuccess: () => {
            Swal.fire({
              title: "Eliminado",
              text: "El permiso fue eliminado correctamente.",
              icon: "success",
              background: "#212529",
              color: "#fff",
              confirmButtonColor: "#198754",
            });
          },
        });
      }
    });
  };

  // 🆕 Función para eliminar TODOS los usuarios del dispositivo
  const handleCleanAll = () => {
    if (!allowedUsers.length) {
      Swal.fire({
        title: "Sin usuarios",
        text: "No hay usuarios asignados a este dispositivo.",
        icon: "info",
        background: "#212529",
        color: "#fff",
        confirmButtonColor: "#198754",
      });
      return;
    }

    Swal.fire({
      title: "¿Eliminar todos los permisos?",
      text: `Esto eliminará **todos los accesos** del dispositivo ${id} y enviará el comando CLEAN USER.`,
      icon: "warning",
      background: "#212529",
      color: "#fff",
      iconColor: "#ffc107",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar todo",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        cleanAllMutation.mutate(id, {
          onSuccess: (message) => {
            Swal.fire({
              title: "Limpieza completada",
              text:
                message ||
                "Todos los usuarios y permisos fueron eliminados del dispositivo.",
              icon: "success",
              background: "#212529",
              color: "#fff",
              confirmButtonColor: "#198754",
            });
          },
          onError: (error) => {
            Swal.fire({
              title: "Error",
              text: error.message || "Ocurrió un error al limpiar el dispositivo.",
              icon: "error",
              background: "#212529",
              color: "#fff",
              confirmButtonColor: "#dc3545",
            });
          },
        });
      }
    });
  };

  const handleAddUser = () => setShowModal(true);

  const handleConfirmAdd = () => {
    if (!selectedUserId) return;

    const payload = {
      userId: Number(selectedUserId),
      deviceId: Number(id),
      weekZone: Number(weekZone),
      groupNumber: Number(groupNumber),
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      enabled,
    };

    createAccessMutation.mutate(payload, {
      onSuccess: () => {
        Swal.fire({
          title: "Usuario asignado",
          text: "El usuario fue agregado correctamente al dispositivo.",
          icon: "success",
          background: "#212529",
          color: "#fff",
          confirmButtonColor: "#198754",
        });
        setShowModal(false);
        setSelectedUserId("");
        setWeekZone(1);
        setGroupNumber(1);
        setStartTime(new Date().toISOString().slice(0, 16));
        setEndTime(
          new Date(new Date().setMonth(new Date().getMonth() + 1))
            .toISOString()
            .slice(0, 16)
        );
        setEnabled(true);
      },
    });
  };

  if (loadingUsers || loadingDevices || loadingAllowed) {
    return (
      <div className="g-background d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <div className="g-background min-vh-100">
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

        <Card bg="dark" text="light" className="shadow-lg">
          <Card.Header className="text-center fs-4">
            Usuarios Permitidos - Dispositivo {id}
          </Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-between mb-3">
              <Button variant="light" onClick={handleAddUser}>
                <FaPlus className="me-2" />
                Agregar usuario
              </Button>

              {/* 🆕 Botón para limpiar todos los permisos */}
              <Button
                variant="danger"
                onClick={handleCleanAll}
                disabled={cleanAllMutation.isLoading}
              >
                {cleanAllMutation.isLoading ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                      variant="light"
                    />
                    Limpiando...
                  </>
                ) : (
                  <>
                    <FaBroom className="me-2" />
                    Eliminar todos
                  </>
                )}
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
                      <td>{user.userName}</td>
                      <td>{user.groupNumber}</td>
                      <td>{user.authMode}</td>
                      <td>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <FaTrashAlt className="me-1" />
                          Eliminar permiso
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {allowedUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        No hay usuarios asignados
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
