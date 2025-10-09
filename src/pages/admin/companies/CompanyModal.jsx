import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

export function CompanyModal({ show, onHide, company, onSave }) {
    const [formData, setFormData] = useState({ id: null, name: "", contact: "" });

    useEffect(() => {
        if (company) {
            setFormData({
                id: company.id || null,
                name: company.name || "",
            });
        } else { 
            setFormData({ id: null, name: "" });
        }
    }, [company, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static" animation={false}>
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>
                    {formData.id ? "Editar Empresa" : "Nueva Empresa"}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body className="bg-dark text-light">
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            className="bg-secondary text-light border-0"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="light">
                        Guardar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
