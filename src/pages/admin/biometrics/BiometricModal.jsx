import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

export function BiometricModal({ show, onHide, biometric, onSave, role, companies }) {
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
        companyId: role === "SA" ? "" : 1,
    });

    useEffect(() => {
        if (biometric) {
            setFormData({
                ...biometric,
                sleepEnabled: !!biometric.sleepEnabled,
                pushEnabled: !!biometric.pushEnabled,
                companyId: biometric.company?.id || (role === "SA" ? "" : 1),
            });
        }
    }, [biometric, role]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.host) return;
        if (role === "SA" && !formData.companyId) return; // obligatorio seleccionar empresa
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>{formData.id ? "Editar Dispositivo" : "Nuevo Dispositivo"}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="bg-dark text-light">
                    {role === "SA" && (
                        <Form.Group className="mb-3">
                            <Form.Label>Empresa</Form.Label>
                            <Form.Select
                                className="bg-secondary text-light border-0"
                                value={formData.companyId}
                                onChange={(e) => handleChange("companyId", Number(e.target.value))}
                                required
                            >
                                <option value="">Seleccione una empresa</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Dispositivo</Form.Label>
                        <Form.Control
                            type="text"
                            className="bg-secondary text-light border-0"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
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
                                required
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
                </Modal.Body>

                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                    <Button variant="light" type="submit">Guardar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
