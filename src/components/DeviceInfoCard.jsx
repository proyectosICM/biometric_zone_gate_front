import { Card, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";

export function DeviceInfoCard({ deviceInfo, onEdit }) {
  const [showModal, setShowModal] = useState(false);
  const [editedDevice, setEditedDevice] = useState({ ...deviceInfo });

  const handleChange = (field, value) => {
    setEditedDevice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdminPwdChange = (field, value) => {
    setEditedDevice((prev) => ({
      ...prev,
      adminPwd: {
        ...prev.adminPwd,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log("Guardando cambios:", editedDevice);
    onEdit?.(editedDevice);
    setShowModal(false);
  };

  return (
    <>
      <Card bg="dark" text="light" className="shadow-lg mb-4">
        <Card.Header className="text-center fs-4">Configuración del Dispositivo</Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}><strong>Nombre del dispositivo:</strong> {deviceInfo.devName}</Col>
            <Col md={6}><strong>Host del servidor:</strong> {deviceInfo.serverHost}</Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}><strong>Puerto del servidor:</strong> {deviceInfo.serverPort}</Col>
            <Col md={6}><strong>Push habilitado:</strong> {deviceInfo.pushEnable}</Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}><strong>Idioma:</strong> {deviceInfo.language}</Col>
            <Col md={6}><strong>Volumen:</strong> {deviceInfo.volume}</Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}><strong>Anti-passback:</strong> {deviceInfo.antiPass}</Col>
            <Col md={6}><strong>Tiempo de sueño:</strong> {deviceInfo.sleepTime} min</Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}><strong>Modo de verificación:</strong> {deviceInfo.verifyMode}</Col>
          </Row>
          <hr className="border-light" />
          <Row className="mb-3">
            <Col md={6}><strong>Contraseña antigua de admin:</strong> {deviceInfo.adminPwd.oldPwd}</Col>
            <Col md={6}><strong>Nueva contraseña:</strong> {deviceInfo.adminPwd.newPwd}</Col>
          </Row>

          <div className="text-end mt-4">
            <Button variant="outline-light" onClick={() => setShowModal(true)}>
              Cambiar configuración de biométrico
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>Editar Configuración del Dispositivo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del dispositivo</Form.Label>
              <Form.Control
                type="text"
                className="bg-secondary text-light border-0"
                value={editedDevice.devName}
                onChange={(e) => handleChange("devName", e.target.value)}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Label>Host del servidor</Form.Label>
                <Form.Control
                  type="text"
                  className="bg-secondary text-light border-0"
                  value={editedDevice.serverHost}
                  onChange={(e) => handleChange("serverHost", e.target.value)}
                />
              </Col>
              <Col>
                <Form.Label>Puerto del servidor</Form.Label>
                <Form.Control
                  type="number"
                  className="bg-secondary text-light border-0"
                  value={editedDevice.serverPort}
                  onChange={(e) => handleChange("serverPort", e.target.value)}
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Push habilitado</Form.Label>
              <Form.Select
                className="bg-secondary text-light border-0"
                value={editedDevice.pushEnable}
                onChange={(e) => handleChange("pushEnable", e.target.value)}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Label>Idioma</Form.Label>
                <Form.Control
                  type="text"
                  className="bg-secondary text-light border-0"
                  value={editedDevice.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                />
              </Col>
              <Col>
                <Form.Label>Volumen</Form.Label>
                <Form.Control
                  type="number"
                  className="bg-secondary text-light border-0"
                  value={editedDevice.volume}
                  onChange={(e) => handleChange("volume", e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Anti-passback</Form.Label>
                <Form.Select
                  className="bg-secondary text-light border-0"
                  value={editedDevice.antiPass}
                  onChange={(e) => handleChange("antiPass", e.target.value)}
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Tiempo de sueño (min)</Form.Label>
                <Form.Control
                  type="number"
                  className="bg-secondary text-light border-0"
                  value={editedDevice.sleepTime}
                  onChange={(e) => handleChange("sleepTime", e.target.value)}
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Modo de verificación</Form.Label>
              <Form.Control
                type="text"
                className="bg-secondary text-light border-0"
                value={editedDevice.verifyMode}
                onChange={(e) => handleChange("verifyMode", e.target.value)}
              />
            </Form.Group>

            <hr className="border-light" />

            <Form.Group className="mb-3">
              <Form.Label>Contraseña antigua de admin</Form.Label>
              <Form.Control
                type="password"
                className="bg-secondary text-light border-0"
                value={editedDevice.adminPwd.oldPwd}
                onChange={(e) => handleAdminPwdChange("oldPwd", e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                className="bg-secondary text-light border-0"
                value={editedDevice.adminPwd.newPwd}
                onChange={(e) => handleAdminPwdChange("newPwd", e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
