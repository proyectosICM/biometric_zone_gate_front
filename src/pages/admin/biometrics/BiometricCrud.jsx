import { useState } from "react";
import { Button, Col, Container, Row, Spinner, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { BiometricTable } from "./BiometricTable";
import { BiometricModal } from "./BiometricModal";
import { CustomNavbar } from "../../../components/CustomNavbar";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  useGetAllDevicesPaginated,
  useListByCompanyPaginated,
  useCreateDevice,
  useUpdateDevice,
  useDeleteDevice,
  useOpenDoor,
} from "../../../api/hooks/useDevice";

import { useGetAllCompanies } from "../../../api/hooks/useCompany";

export function BiometricCrud() {
  const navigate = useNavigate();

  const loggedCompany = localStorage.getItem("bzg_companyId");
  const role = localStorage.getItem("bzg_role");

  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState("desc");

  const openDoor = useOpenDoor();

  // Queries de dispositivos
  const allDevicesQuery = useGetAllDevicesPaginated(page, size, sortBy, direction);
  const companyDevicesQuery = useListByCompanyPaginated(
    selectedCompany === "ALL" ? loggedCompany : selectedCompany,
    page,
    size,
    sortBy,
    direction
  );

  const data =
    role === "SA"
      ? (selectedCompany === "ALL" ? allDevicesQuery.data : companyDevicesQuery.data)
      : companyDevicesQuery.data;

  const isLoading =
    role === "SA"
      ? (selectedCompany === "ALL" ? allDevicesQuery.isLoading : companyDevicesQuery.isLoading)
      : companyDevicesQuery.isLoading;

  const isError =
    role === "SA"
      ? (selectedCompany === "ALL" ? allDevicesQuery.isError : companyDevicesQuery.isError)
      : companyDevicesQuery.isError;

  // Companies
  const companiesQuery = useGetAllCompanies();
  const companies = companiesQuery.data || [];

  // Mutations
  const createDevice = useCreateDevice();
  const updateDevice = useUpdateDevice();
  const deleteDevice = useDeleteDevice();

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  const devices = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  const handleOpenDoor = async (id) => {
    Swal.fire({
      title: "¿Abrir puerta?",
      text: "Esto enviará la señal de apertura al dispositivo.",
      icon: "question",
      showCancelButton: true,
      background: "#212529",
      color: "#fff",
      confirmButtonColor: "#198754",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, abrir",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await openDoor.mutateAsync(id);
          Swal.fire({
            title: "Puerta abierta",
            text: "La puerta se abrió correctamente.",
            icon: "success",
            background: "#212529",
            color: "#fff",
            confirmButtonColor: "#198754",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo abrir la puerta.",
            icon: "error",
            background: "#212529",
            color: "#fff",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  const handleSave = async (deviceData) => {
    try {
      const payload = {
        sn: deviceData.sn,
        name: deviceData.name,
        company: { id: role === "SA" ? deviceData.companyId : loggedCompany },
      };

      if (deviceData.id) {
        await updateDevice.mutateAsync({ id: deviceData.id, data: payload });
        Swal.fire({
          title: "Actualizado",
          text: "El dispositivo fue editado correctamente",
          icon: "success",
          background: "#212529",
          color: "#fff",
          confirmButtonColor: "#198754",
        });
      } else {
        await createDevice.mutateAsync(payload);
        Swal.fire({
          title: "Agregado",
          text: "Dispositivo creado correctamente",
          icon: "success",
          background: "#212529",
          color: "#fff",
          confirmButtonColor: "#198754",
        });
      }

      setShowModal(false);
      setEditingDevice(null);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el dispositivo",
        icon: "error",
        background: "#212529",
        color: "#fff",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      background: "#212529",
      color: "#fff",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDevice.mutateAsync(id);
          Swal.fire({
            title: "Eliminado",
            text: "El dispositivo ha sido eliminado correctamente",
            icon: "success",
            background: "#212529",
            color: "#fff",
            confirmButtonColor: "#198754",
          });
        } catch {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el dispositivo",
            icon: "error",
            background: "#212529",
            color: "#fff",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  const handleManageUsers = (id) => {
    navigate(`/usuarios-permitidos/${id}`);
  };

  if (isLoading) {
    return (
      <div className="g-background d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-danger mt-5">
        <h5>Error al cargar dispositivos</h5>
      </div>
    );
  }

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

        <h2 className="text-white text-center mb-4">Gestión de Dispositivos</h2>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-light">Dispositivos Registrados</h3>

          {role === "SA" && (
            <Form.Select
              className="bg-secondary text-light border-0 me-2"
              style={{ width: "220px" }}
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setPage(0);
              }}
            >
              <option value="ALL">Todas las empresas</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          )}

          <Button
            variant="outline-success"
            onClick={() => {
              setEditingDevice({
                name: "",
                host: "",
                port: "",
                pushEnabled: true,
                language: 0,
                volume: 5,
                antiPassback: 0,
                sleepEnabled: true,
                verificationMode: 0,
                companyId: role === "SA" ? "" : loggedCompany,
              });
              setShowModal(true);
            }}
          >
            + Nuevo Dispositivo
          </Button>
        </div>

        <BiometricTable
          biometrics={devices}
          onEdit={(device) => {
            setEditingDevice(device);
            setShowModal(true);
          }}
          onDelete={handleDelete}
          onManageUsers={handleManageUsers}
          onOpenDoor={handleOpenDoor}
        />

        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="outline-light"
            className="me-2"
            disabled={page === 0}
            onClick={() => handlePageChange(page - 1)}
          >
            ← Anterior
          </Button>
          <span className="text-light align-self-center">
            Página {page + 1} de {totalPages}
          </span>
          <Button
            variant="outline-light"
            className="ms-2"
            disabled={page + 1 >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Siguiente →
          </Button>
        </div>

        <BiometricModal
          show={showModal}
          onHide={() => setShowModal(false)}
          biometric={editingDevice}
          onSave={handleSave}
          role={role}
          companies={companies}
        />
      </Container>
    </div>
  );
}
