import { Card, Row, Col, Button, Modal, Form, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useGetDeviceById, useUpdateDevice } from "../api/hooks/useDevice";

export function DeviceInfoCard({ deviceId }) {
  const { data: deviceInfo, isLoading, isError } = useGetDeviceById(deviceId);
  const updateDevice = useUpdateDevice();

  const [showModal, setShowModal] = useState(false);
  const [editedDevice, setEditedDevice] = useState(null);

  // Copiar datos cuando cambien
  useEffect(() => {
    if (deviceInfo) { 
      setEditedDevice({ ...deviceInfo });
    }
  }, [deviceInfo]);

  const handleChange = (field, value) => {
    setEditedDevice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updateDevice.mutate(
      { id: deviceId, data: editedDevice },
      {
        onSuccess: () => {
          setShowModal(false);
          Swal.fire({
            title: "Configuración guardada",
            text: "Los cambios del dispositivo se aplicaron correctamente.",
            icon: "success",
            background: "#212529",
            color: "#fff",
            confirmButtonColor: "#198754",
          });
        },
        onError: () => {
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar el dispositivo.",
            icon: "error",
            background: "#212529",
            color: "#fff",
          });
        },
      }
    );
  };

  if (isLoading || !editedDevice) {
    return (
      <div className="text-center text-light py-5">
        <Spinner animation="border" variant="light" /> <br />
        <small>Cargando dispositivo...</small>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-danger py-5">
        Error al cargar los datos del dispositivo.
      </div>
    );
  }

  return (
    <>
      <Card bg="dark" text="light" className="shadow-lg mb-4">
        <Card.Header className="text-center fs-4">
          Configuración del Dispositivo
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <strong>ID:</strong> {deviceInfo.id}
            </Col>
            <Col md={6}>
              <strong>SN:</strong> {deviceInfo.sn}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Nombre:</strong> {deviceInfo.name}
            </Col>
            <Col md={6}>
              <strong>Empresa:</strong> {deviceInfo.company?.name || "—"}
            </Col>
          </Row>


  { /*       <Row className="mb-3">
            <Col md={6}>
              <strong>Host:</strong> {deviceInfo.host}
            </Col>
            <Col md={6}>
              <strong>Puerto:</strong> {deviceInfo.port}
            </Col>
          </Row>*/}

          <Row className="mb-3">
            <Col md={6}>
              <strong>Idioma:</strong> {deviceInfo.language}
            </Col>
            <Col md={6}>
              <strong>Volumen:</strong> {deviceInfo.volume}
            </Col>
          </Row>
{/*
          <Row className="mb-3">
            <Col md={6}>
              <strong>Anti-passback:</strong> {deviceInfo.antiPassback}
            </Col>
            <Col md={6}>
              <strong>Modo de verificación:</strong>{" "}
              {deviceInfo.verificationMode}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Sleep habilitado:</strong>{" "}
              {deviceInfo.sleepEnabled ? "Sí" : "No"}
            </Col>
            <Col md={6}>
              <strong>Push habilitado:</strong>{" "}
              {deviceInfo.pushEnabled ? "Sí" : "No"}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Usuarios registrados:</strong> {deviceInfo.userFpNum}
            </Col>
            <Col md={6}>
              <strong>Tiempo de reverificación:</strong>{" "}
              {deviceInfo.reverifyTime} min
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <strong>Log Hint:</strong> {deviceInfo.logHint}
            </Col>
          </Row>*/}

          <div className="text-end mt-4">
            <Button variant="outline-light" onClick={() => setShowModal(true)}>
              Editar configuración
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* -------- MODAL DE EDICIÓN -------- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>Editar Configuración del Dispositivo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                className="bg-secondary text-light border-0"
                value={editedDevice.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Label>Host</Form.Label>
                <Form.Control
                  type="text"
                  className="bg-secondary text-light border-0"
                  value={editedDevice.host || ""}
                  onChange={(e) => handleChange("host", e.target.value)}
                />
              </Col>
              <Col>
                <Form.Label>Puerto</Form.Label>
                <Form.Control
                  type="text"
                  className="bg-secondary text-light border-0"
                  value={editedDevice.port || ""}
                  onChange={(e) => handleChange("port", e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Idioma</Form.Label>
                <Form.Control
                  type="number"
                  className="bg-secondary text-light border-0"
                  value={editedDevice.language ?? 0}
                  onChange={(e) =>
                    handleChange("language", Number(e.target.value))
                  }
                />
              </Col>
              <Col>
                <Form.Label>Volumen</Form.Label>
                <Form.Control
                  type="number"
                  className="bg-secondary text-light border-0"
                  value={editedDevice.volume ?? 0}
                  onChange={(e) =>
                    handleChange("volume", Number(e.target.value))
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Anti-passback</Form.Label>
                <Form.Control
                  type="number"
                  className="bg-secondary text-light border-0"
                  value={editedDevice.antiPassback ?? 0}
                  onChange={(e) =>
                    handleChange("antiPassback", Number(e.target.value))
                  }
                />
              </Col>
              <Col>
                <Form.Label>Modo de verificación</Form.Label>
                <Form.Control
                  type="number"
                  className="bg-secondary text-light border-0"
                  value={editedDevice.verificationMode ?? 0}
                  onChange={(e) =>
                    handleChange("verificationMode", Number(e.target.value))
                  }
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Sleep habilitado</Form.Label>
              <Form.Select
                className="bg-secondary text-light border-0"
                value={editedDevice.sleepEnabled ? "true" : "false"}
                onChange={(e) =>
                  handleChange("sleepEnabled", e.target.value === "true")
                }
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Push habilitado</Form.Label>
              <Form.Select
                className="bg-secondary text-light border-0"
                value={editedDevice.pushEnabled ? "true" : "false"}
                onChange={(e) =>
                  handleChange("pushEnabled", e.target.value === "true")
                }
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tiempo de reverificación (min)</Form.Label>
              <Form.Control
                type="number"
                className="bg-secondary text-light border-0"
                value={editedDevice.reverifyTime ?? 0}
                onChange={(e) =>
                  handleChange("reverifyTime", Number(e.target.value))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Log Hint</Form.Label>
              <Form.Control
                type="number"
                className="bg-secondary text-light border-0"
                value={editedDevice.logHint ?? 0}
                onChange={(e) =>
                  handleChange("logHint", Number(e.target.value))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="light"
            onClick={handleSave}
            disabled={updateDevice.isLoading}
          >
            {updateDevice.isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
