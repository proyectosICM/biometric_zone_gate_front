import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FaFingerprint, FaCamera, FaIdCard } from "react-icons/fa";
import { MdPin } from "react-icons/md";

export function UserModal({ show, onHide, user, onSave }) {
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        email: "",
        role: "Usuario",
        authMethod: "Huella",
        authData: ""
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const simulateRFID = () => {
        // Generar un ID aleatorio para simular la tarjeta
        const randomId = `RFID-${Math.floor(1000 + Math.random() * 9000)}-${Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase()}`;
        setFormData({ ...formData, authData: `Tarjeta registrada: ${randomId}` });
    };

    const renderAuthField = () => {
        switch (formData.authMethod) {
            case "Huella":
                return (
                    <div className="text-center mt-3">
                        <Button
                            variant="outline-light"
                            onClick={() =>
                                setFormData({ ...formData, authData: "Huella registrada ✅" })
                            }
                        >
                            <FaFingerprint className="me-2" />
                            Simular lectura de huella
                        </Button>
                        <p className="mt-2">{formData.authData}</p>
                    </div>
                );
            case "PIN":
                return (
                    <Form.Group className="mb-3">
                        <Form.Label>PIN de acceso</Form.Label>
                        <Form.Control
                            type="password"
                            maxLength={6}
                            name="authData"
                            className="bg-secondary text-light border-0"
                            placeholder="Ingrese un PIN"
                            value={formData.authData}
                            onChange={handleChange}
                        />
                    </Form.Group>
                );
            case "Tarjeta":
                return (
                    <div className="text-center mt-3">
                        <Button variant="outline-warning" onClick={simulateRFID}>
                            <FaIdCard className="me-2" />
                            Simular lectura de tarjeta
                        </Button>
                        <p className="mt-2">{formData.authData}</p>
                    </div>
                );
            case "Reconocimiento Facial":
                return (
                    <div className="text-center mt-3">
                        <Button
                            variant="outline-info"
                            onClick={() =>
                                setFormData({ ...formData, authData: "Rostro registrado ✅" })
                            }
                        >
                            <FaCamera className="me-2" />
                            Capturar rostro
                        </Button>
                        <p className="mt-2">{formData.authData}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>{formData.id ? "Editar Usuario" : "Nuevo Usuario"}</Modal.Title>
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
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            className="bg-secondary text-light border-0"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Select
                            name="role"
                            className="bg-secondary text-light border-0"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option>Admin</option>
                            <option>Usuario</option>
                            <option>Supervisor</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Método de Autenticación</Form.Label>
                        <Form.Select
                            name="authMethod"
                            className="bg-secondary text-light border-0"
                            value={formData.authMethod}
                            onChange={handleChange}
                        >
                            <option>Huella</option>
                            <option>PIN</option>
                            <option>Tarjeta</option>
                            <option>Reconocimiento Facial</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Render dinámico según el método */}
                    {renderAuthField()}
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
