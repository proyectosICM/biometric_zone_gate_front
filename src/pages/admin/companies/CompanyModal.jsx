import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

export function CompanyModal({ show, onHide, company, onSave }) {
    const [formData, setFormData] = useState({ id: null, name: "", industry: "", contact: "" });

    useEffect(() => {
        if (company) {
            setFormData(company);
        }
    }, [company]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>{formData.id ? "Editar Empresa" : "Nueva Empresa"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            className="bg-secondary text-light border-0"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rubro</Form.Label>
                        <Form.Control
                            type="text"
                            name="industry"
                            className="bg-secondary text-light border-0"
                            value={formData.industry}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contacto</Form.Label>
                        <Form.Control
                            type="email"
                            name="contact"
                            className="bg-secondary text-light border-0"
                            value={formData.contact}
                            onChange={handleChange}
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
