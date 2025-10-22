import { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export function BiometricModal({ show, onHide, biometric, onSave, role, companies }) {
    const [formData, setFormData] = useState({
        id: null,
        sn: "",
        name: "",
        companyId: role === "SA" ? "" : 1,
    });

    useEffect(() => { 
        if (biometric) {
            setFormData({
                id: biometric.id,
                sn: biometric.sn || "",
                name: biometric.name || "",
                companyId: biometric.company?.id || (role === "SA" ? "" : 1),
            });
        }
    }, [biometric, role]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.sn || !formData.name) return;
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
                        <Form.Label>SN</Form.Label>
                        <Form.Control
                            type="text"
                            className="bg-secondary text-light border-0"
                            value={formData.sn}
                            onChange={(e) => handleChange("sn", e.target.value)}
                            required
                        />
                    </Form.Group>

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
                </Modal.Body>

                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                    <Button variant="light" type="submit">Guardar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
