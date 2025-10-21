import { useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { EventTypeTable } from "./EventTypeTable";
import { EventTypeModal } from "./EventTypeModal";
import { CustomNavbar } from "../../../components/CustomNavbar";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useGetAllEventTypes,
  useCreateEventType,
  useUpdateEventType,
  useDeleteEventType,
  useClearAllEventTypes,
} from "../../../api/hooks/useEventType";

export function EventTypeCrud() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetAllEventTypes();
  const createEventType = useCreateEventType();
  const updateEventType = useUpdateEventType();
  const deleteEventType = useDeleteEventType();
  const clearAllEventTypes = useClearAllEventTypes();

  const [showModal, setShowModal] = useState(false);
  const [editingEventType, setEditingEventType] = useState(null);

  const eventTypes = data || [];

  const handleSave = async (eventTypeData) => {
    try {
      if (!eventTypeData.name?.trim()) {
        Swal.fire({
          title: "Error",
          text: "El nombre es obligatorio",
          icon: "error",
          background: "#212529",
          color: "#fff",
          confirmButtonColor: "#d33",
        });
        return;
      }

      if (eventTypeData.id) {
        await updateEventType.mutateAsync({
          id: eventTypeData.id,
          data: eventTypeData,
        });
        Swal.fire({
          title: "Actualizado",
          text: "El tipo de evento fue editado correctamente",
          icon: "success",
          background: "#212529",
          color: "#fff",
          confirmButtonColor: "#198754",
        });
      } else {
        await createEventType.mutateAsync(eventTypeData);
        Swal.fire({
          title: "Agregado",
          text: "Tipo de evento creado correctamente",
          icon: "success",
          background: "#212529",
          color: "#fff",
          confirmButtonColor: "#198754",
        });
      }

      setShowModal(false);
      setEditingEventType(null);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el tipo de evento",
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
          await deleteEventType.mutateAsync(id);
          Swal.fire({
            title: "Eliminado",
            text: "El tipo de evento fue eliminado correctamente",
            icon: "success",
            background: "#212529",
            color: "#fff",
            confirmButtonColor: "#198754",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el tipo de evento",
            icon: "error",
            background: "#212529",
            color: "#fff",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  const handleClearAll = () => {
    Swal.fire({
      title: "¿Eliminar todos los tipos de evento?",
      text: "Esta acción eliminará todos los registros.",
      icon: "warning",
      showCancelButton: true,
      background: "#212529",
      color: "#fff",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar todo",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clearAllEventTypes.mutateAsync();
          Swal.fire({
            title: "Completado",
            text: "Todos los tipos de evento fueron eliminados",
            icon: "success",
            background: "#212529",
            color: "#fff",
            confirmButtonColor: "#198754",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar todos los registros",
            icon: "error",
            background: "#212529",
            color: "#fff",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
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
        <h5>Error al cargar los tipos de evento</h5>
      </div>
    );
  }

  const clearFocus = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="g-background">
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

        <h2 className="text-white text-center mb-4">Gestión de Tipos de Evento</h2>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-light">Tipos de Evento Registrados</h3>
     {/*     <div className="d-flex gap-2">
            <Button
              variant="outline-success"
              onClick={() => {
                clearFocus();
                setEditingEventType({ code: "", name: "", description: "" });
                setShowModal(true);
              }}
            >
              + Nuevo Tipo
            </Button>
            <Button variant="outline-danger" onClick={handleClearAll}>
              Eliminar Todo
            </Button>
          </div>*/}
        </div>

        <EventTypeTable
          eventTypes={eventTypes}
          onEdit={(eventType) => {
            setEditingEventType(eventType);
            setShowModal(true);
          }}
          onDelete={handleDelete}
        />

        <EventTypeModal
          show={showModal}
          onHide={() => setShowModal(false)}
          eventType={editingEventType}
          onSave={handleSave}
        />
      </Container>
    </div>
  );
}
