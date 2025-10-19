import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

export function UserModal({ show, onHide, user, onSave, role, companies }) {
    const [formData, setFormData] = useState({
        id: null,
        enrollId: "",
        name: "",
        email: "",
        username: "",
        password: "",
        adminLevel: 0,
        enabled: true,
        isWebUser: false,
        companyId: role === "SA" ? "" : 1,
    });

    const [credentials, setCredentials] = useState([
        { type: "PASSWORD", backupNum: 10, record: "" },
    ]);

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
                isWebUser: !!user.username, // si tiene username, es usuario web
                companyId: user.company?.id || (role === "SA" ? "" : 1),
            });

            setCredentials(
                user.credentials && user.credentials.length
                    ? user.credentials
                    : [{ type: "PASSWORD", backupNum: 10, record: "" }]
            );
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
                isWebUser: false,
                companyId: role === "SA" ? "" : 1,
            });
            setCredentials([{ type: "PASSWORD", backupNum: 10, record: "" }]);
        }
    }, [user, show, role]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // === Manejo de credenciales ===
    const handleCredentialChange = (index, field, value) => {
        const updated = [...credentials];
        updated[index][field] = value;

        if (field === "type") {
            updated[index].backupNum =
                value === "PASSWORD"
                    ? 10
                    : value === "CARD"
                    ? 11
                    : 12; // fingerprint u otros
        }

        setCredentials(updated);
    };

    const addCredential = () => {
        setCredentials([
            ...credentials,
            { type: "PASSWORD", backupNum: 10, record: "" },
        ]);
    };

    const removeCredential = (index) => {
        setCredentials(credentials.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return;
        if (role === "SA" && !formData.companyId) return;

        // Si no es usuario web, limpiamos username y password
        const finalForm = { ...formData };
        if (!formData.isWebUser) {
            finalForm.username = null;
            finalForm.password = null;
        }

        const finalData = {
            ...finalForm,
            company: { id: Number(finalForm.companyId) },
            credentials: credentials,
        };

        onSave(finalData);
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

                    {/* === Toggle Usuario Web === */}
                    <Form.Group className="mb-3" controlId="isWebUserSwitch">
                        <Form.Check
                            type="switch"
                            name="isWebUser"
                            label="Usuario Web"
                            checked={formData.isWebUser}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* === Campos de usuario web condicionales === */}
                    {formData.isWebUser && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Usuario Web</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    className="bg-secondary text-light border-0"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required={formData.isWebUser}
                                />
                            </Form.Group>

                            {!formData.id && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña Web</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        className="bg-secondary text-light border-0"
                                        placeholder="••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required={formData.isWebUser}
                                    />
                                </Form.Group>
                            )}
                        </>
                    )}

                    {role === "SA" && (
                        <Form.Group className="mb-3">
                            <Form.Label>Empresa</Form.Label>
                            <Form.Select
                                name="companyId"
                                className="bg-secondary text-light border-0"
                                value={formData.companyId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        companyId: Number(e.target.value),
                                    })
                                }
                                required
                            >
                                <option value="">Seleccione una empresa</option>
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </Form.Select>
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

                    {/* === Sección de credenciales === */}
                    <hr className="border-secondary" />
                    <h5 className="text-info mb-3">Credenciales</h5>

                    {credentials.map((cred, index) => (
                        <div
                            key={index}
                            className="bg-secondary rounded p-3 mb-3 border border-dark"
                        >
                            <Form.Group className="mb-2">
                                <Form.Label>Tipo</Form.Label>
                                <Form.Select
                                    className="bg-dark text-light border-0"
                                    value={cred.type}
                                    onChange={(e) =>
                                        handleCredentialChange(index, "type", e.target.value)
                                    }
                                >
                                    <option value="PASSWORD">Contraseña</option>
                                    <option value="CARD">Tarjeta</option>
                                    <option value="FINGERPRINT">Huella</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>BackupNum</Form.Label>
                                <Form.Control
                                    type="number"
                                    className="bg-dark text-light border-0"
                                    value={cred.backupNum}
                                    onChange={(e) =>
                                        handleCredentialChange(index, "backupNum", Number(e.target.value))
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Dato / Record</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="bg-dark text-light border-0"
                                    placeholder={
                                        cred.type === "PASSWORD"
                                            ? "Ej. 1234"
                                            : cred.type === "CARD"
                                            ? "Número de tarjeta"
                                            : "Template de huella"
                                    }
                                    value={cred.record}
                                    onChange={(e) =>
                                        handleCredentialChange(index, "record", e.target.value)
                                    }
                                />
                            </Form.Group>

                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeCredential(index)}
                            >
                                Eliminar
                            </Button>
                        </div>
                    ))}

                    <Button variant="outline-light" size="sm" onClick={addCredential}>
                        + Añadir Credencial
                    </Button>
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
