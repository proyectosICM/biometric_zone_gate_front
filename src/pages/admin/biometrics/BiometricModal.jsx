import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

export function BiometricModal({ show, onHide, biometric, onSave }) {
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        host: "",
        port: "",
        language: 9,
        volume: 5,
        antiPassback: 0,
        sleepEnabled: false,
        verificationMode: 0,
        pushEnabled: true,
    });

    useEffect(() => {
        if (biometric) {
            setFormData({
                ...biometric,
                sleepEnabled: !!biometric.sleepEnabled,
                pushEnabled: !!biometric.pushEnabled
            });
        }
    }, [biometric]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>{formData.id ? "Editar Dispositivo" : "Nuevo Dispositivo"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Dispositivo</Form.Label>
                        <Form.Control
                            type="text"
                            className="bg-secondary text-light border-0"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
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
                                onChange={(e) => handleChange("port", Number(e.target.value))}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Idioma</Form.Label>
                            <Form.Select
                                className="bg-secondary text-light border-0"
                                value={formData.language}
                                onChange={(e) => handleChange("language", Number(e.target.value))}
                            >
                                <option value={0}>English</option>
                                <option value={9}>Spanish</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Label>Volumen</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                max={10}
                                className="bg-secondary text-light border-0"
                                value={formData.volume}
                                onChange={(e) => handleChange("volume", Number(e.target.value))}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Anti-passback</Form.Label>
                            <Form.Select
                                className="bg-secondary text-light border-0"
                                value={formData.antiPassback}
                                onChange={(e) => handleChange("antiPassback", Number(e.target.value))}
                            >
                                <option value={0}>Deshabilitado</option>
                                <option value={1}>Host Inside</option>
                                <option value={2}>Host Outside</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Label>Modo de sueño</Form.Label>
                            <Form.Check
                                type="switch"
                                label="Habilitado"
                                checked={formData.sleepEnabled}
                                onChange={(e) => handleChange("sleepEnabled", e.target.checked)}
                            />
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Modo de verificación</Form.Label>
                        <Form.Select
                            className="bg-secondary text-light border-0"
                            value={formData.verificationMode}
                            onChange={(e) => handleChange("verificationMode", Number(e.target.value))}
                        >
                            <option value={0}>FP o Card o Pwd</option>
                            <option value={1}>Card + FP</option>
                            <option value={2}>Pwd + FP</option>
                            <option value={3}>Card + FP + Pwd</option>
                            <option value={4}>Card + Pwd</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Push habilitado</Form.Label>
                        <Form.Check
                            type="switch"
                            label="Sí"
                            checked={formData.pushEnabled}
                            onChange={(e) => handleChange("pushEnabled", e.target.checked)}
                        />
                    </Form.Group>

                    <hr className="border-light" />

                  
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark border-secondary">
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button variant="light" onClick={() => onSave(formData)}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    );
}
