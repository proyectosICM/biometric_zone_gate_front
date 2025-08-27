// BiometricModal.jsx
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

export function BiometricModal({ show, onHide, biometric, onSave }) {
    const [formData, setFormData] = useState({
        id: null,
        deviceName: "",
        host: "",
        port: "",
        push: "Yes",
        language: "ES",
        volume: "",
        antipassback: "No",
        sleep: "",
        verificationMode: "Fingerprint",
        oldPassword: "",
        newPassword: "",
    });

    useEffect(() => {
        if (biometric) {
            setFormData(biometric);
        }
    }, [biometric]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>
                    {formData.id ? "Editar Dispositivo" : "Nuevo Dispositivo"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Dispositivo</Form.Label>
                        <Form.Control
                            type="text"
                            className="bg-secondary text-light border-0"
                            value={formData.deviceName}
                            onChange={(e) => handleChange("deviceName", e.target.value)}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Host</Form.Label>
                            <Form.Control
                                type="text"
                                className="bg-secondary text-light border-0"
                                value={formData.host}
                                onChange={(e) => handleChange("host", e.target.value)}
                            />
                        </Col>
                        <Col>
                            <Form.Label>Puerto</Form.Label>
                            <Form.Control
                                type="number"
                                className="bg-secondary text-light border-0"
                                value={formData.port}
                                onChange={(e) => handleChange("port", e.target.value)}
                            />
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Push habilitado</Form.Label>
                        <Form.Select
                            className="bg-secondary text-light border-0"
                            value={formData.push}
                            onChange={(e) => handleChange("push", e.target.value)}
                        >
                            <option value="Yes">Sí</option>
                            <option value="No">No</option>
                        </Form.Select>
                    </Form.Group>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Idioma</Form.Label>
                            <Form.Control
                                type="text"
                                className="bg-secondary text-light border-0"
                                value={formData.language}
                                onChange={(e) => handleChange("language", e.target.value)}
                            />
                        </Col>
                        <Col>
                            <Form.Label>Volumen</Form.Label>
                            <Form.Control
                                type="number"
                                className="bg-secondary text-light border-0"
                                value={formData.volume}
                                onChange={(e) => handleChange("volume", e.target.value)}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Anti-passback</Form.Label>
                            <Form.Select
                                className="bg-secondary text-light border-0"
                                value={formData.antipassback}
                                onChange={(e) => handleChange("antipassback", e.target.value)}
                            >
                                <option value="Yes">Sí</option>
                                <option value="No">No</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Label>Tiempo de sueño</Form.Label>
                            <Form.Control
                                type="number"
                                className="bg-secondary text-light border-0"
                                value={formData.sleep}
                                onChange={(e) => handleChange("sleep", e.target.value)}
                            />
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Modo de verificación</Form.Label>
                        <Form.Control
                            type="text"
                            className="bg-secondary text-light border-0"
                            value={formData.verificationMode}
                            onChange={(e) =>
                                handleChange("verificationMode", e.target.value)
                            }
                        />
                    </Form.Group>

                    <hr className="border-light" />

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña antigua</Form.Label>
                        <Form.Control
                            type="password"
                            className="bg-secondary text-light border-0"
                            value={formData.oldPassword}
                            onChange={(e) => handleChange("oldPassword", e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nueva contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            className="bg-secondary text-light border-0"
                            value={formData.newPassword}
                            onChange={(e) => handleChange("newPassword", e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark border-secondary">
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="light" onClick={() => onSave(formData)}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
