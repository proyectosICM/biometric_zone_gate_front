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
        role: "USER",
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
                role: user.role || "USER",
                adminLevel: user.adminLevel != null ? user.adminLevel : mapRoleToAdminLevel(user.role || "USER"),
                enabled: user.enabled ?? true,
                isWebUser: !!user.username, // si tiene username => es web user
                companyId: user.company?.id || (role === "SA" ? "" : 1),
            });

            setCredentials(
                user.credentials && user.credentials.length
                    ? user.credentials.map(c => ({
                        id: c.id || null,
                        type: c.type,
                        backupNum: c.backupNum,
                        record: c.record
                    }))
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

        if (name === "isWebUser" && !checked) {
            setFormData((prev) => ({
                ...prev,
                isWebUser: false,
                email: "",
                username: "",
                password: "",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
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
                        : value === "PHOTO"
                            ? 50  // 👈 aquí facial
                            : 0;  // default fingerprint
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
        if (!formData.name) return;
        if (role === "SA" && !formData.companyId) return;


        const finalForm = { ...formData };

        if (!formData.isWebUser) {
            finalForm.email = null;
            finalForm.username = null;
            finalForm.password = null;
        }

        const finalData = {
            ...finalForm,
            companyId: Number(finalForm.companyId),
            credentials,
        };

        console.log(finalData)
        onSave(finalData);
    };

    const mapRoleToAdminLevel = (role) => (role === "USER" ? 0 : 1);

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
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    className="bg-secondary text-light border-0"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required={formData.isWebUser}
                                />
                            </Form.Group>

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
                        <Form.Label>Rol</Form.Label>
                        <Form.Select
                            name="role"
                            className="bg-secondary text-light border-0"
                            value={formData.role}
                            onChange={(e) => {
                                const newRole = e.target.value;
                                setFormData(prev => ({
                                    ...prev,
                                    role: newRole,
                                    adminLevel: mapRoleToAdminLevel(newRole), 
                                }));
                            }}
                        >
                            <option value="USER">Usuario Normal</option>
                            <option value="ADMIN">Administrador</option>
                            {role === "SA" && <option value="SA">Super Usuario</option>}
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
                        <div key={index} className="bg-secondary rounded p-3 mb-3 border border-dark">

                            <Form.Group className="mb-2">
                                <Form.Label>Tipo</Form.Label>
                                <Form.Select
                                    className="bg-dark text-light border-0"
                                    value={cred.type}
                                    onChange={(e) => handleCredentialChange(index, "type", e.target.value)}
                                    disabled={cred.type === "FINGERPRINT" || cred.type === "PHOTO"}
                                >
                                    <option value="PASSWORD">Contraseña</option>
                                    <option value="CARD">Tarjeta RFID</option>
                                    <option value="FINGERPRINT">Huella</option>
                                    <option value="PHOTO">Foto / Facial</option>
                                </Form.Select>
                            </Form.Group>

                            {/* FOTO: si no hay record, permitir subir */}
                            {cred.type === "PHOTO" && !cred.record && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id={`photoUpload-${index}`}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                handleCredentialChange(index, "record", reader.result.split(",")[1]);
                                                // split(",")[1] quita "data:image/jpeg;base64,"
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                    />

                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        className="mb-2"
                                        onClick={() => document.getElementById(`photoUpload-${index}`).click()}
                                    >
                                        📷 Subir Foto / Facial
                                    </Button>
                                </>
                            )}

                            {/* RECORD solo visible si no es foto o fingerprint */}
                            {(cred.type !== "FINGERPRINT" && cred.type !== "PHOTO") && (
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
                                                    : ""
                                        }
                                        value={cred.record}
                                        onChange={(e) => handleCredentialChange(index, "record", e.target.value)}
                                    />
                                </Form.Group>
                            )}

                            {/* mostrar que ya está cargada */}
                            {cred.type === "PHOTO" && cred.record && (
                                <div className="text-success mb-2">✅ Foto almacenada</div>
                            )}

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
