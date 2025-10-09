import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

export function UserModal({ show, onHide, user, onSave }) {
    const [formData, setFormData] = useState({
        id: null,
        enrollId: "",
        name: "",
        email: "",
        username: "",
        password: "",
        adminLevel: 0,
        enabled: true,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id || null,
                enrollId: user.enrollId || "",
                name: user.name || "",
                email: user.email || "",
                username: user.username || "",
                password: "",
                adminLevel: user.adminLevel ?? 0,
                enabled: user.enabled ?? true,
            });
        } else {
            setFormData({
                id: null,
                enrollId: "",
                name: "",
                email: "",
                username: "",
                password: "",
                adminLevel: 0,
                enabled: true,
            });
        }
    }, [user, show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.username) return;
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static" animation={false}>
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>
                    {formData.id ? "Editar Usuario" : "Nuevo Usuario"}
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

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            className="bg-secondary text-light border-0"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Usuario</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            className="bg-secondary text-light border-0"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {!formData.id && (
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                className="bg-secondary text-light border-0"
                                placeholder="••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Nivel de Administrador</Form.Label>
                        <Form.Select
                            name="adminLevel"
                            className="bg-secondary text-light border-0"
                            value={formData.adminLevel}
                            onChange={handleChange}
                        >
                            <option value={0}>Usuario Normal</option>
                            <option value={1}>Administrador</option>
                            <option value={2}>Super Usuario</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="enabledSwitch">
                        <Form.Check
                            type="switch"
                            name="enabled"
                            label="Usuario Activo"
                            checked={formData.enabled}
                            onChange={handleChange}
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
