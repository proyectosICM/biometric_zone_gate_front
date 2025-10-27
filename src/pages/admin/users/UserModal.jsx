import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

/**
 * Redimensiona una imagen a 512x512, la convierte a JPG (quality=0.85)
 * y devuelve:
 *  - base64: string SIN el prefijo "data:image/jpeg;base64,"
 *  - preview: dataURL para previsualizar en la UI
 */
async function resizeToJpegBase64(file, maxSize = 512, quality = 0.85) {
    const dataURL = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });

    const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = dataURL;
    });

    // Hacemos un recorte centrado a cuadrado y luego lo escalamos a 512x512
    const canvas = document.createElement("canvas");
    canvas.width = maxSize;
    canvas.height = maxSize;
    const ctx = canvas.getContext("2d");

    const { width, height } = img;
    const side = Math.min(width, height);
    const sx = (width - side) / 2;
    const sy = (height - side) / 2;

    ctx.drawImage(img, sx, sy, side, side, 0, 0, maxSize, maxSize);

    const outDataURL = canvas.toDataURL("image/jpeg", quality);
    const base64 = outDataURL.split(",")[1]; // sin prefijo
    return { base64, preview: outDataURL };
}

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

    // credentials: además de type/backupNum/record, guardamos "preview" (solo UI, no se envía)
    const [credentials, setCredentials] = useState([
        { type: "PASSWORD", backupNum: 10, record: "", preview: null },
    ]);

    // Mapea role → adminLevel (USER:0, ADMIN/SA:1)
    const mapRoleToAdminLevel = (r) => (r === "USER" ? 0 : 1);

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
                adminLevel:
                    user.adminLevel != null
                        ? user.adminLevel
                        : mapRoleToAdminLevel(user.role || "USER"),
                enabled: user.enabled ?? true,
                isWebUser: !!user.username,
                companyId: user.companyId || (role === "SA" ? "" : 1),
            });

            setCredentials(
                user.credentials && user.credentials.length
                    ? user.credentials.map((c) => ({
                        id: c.id || null,
                        type: c.type,
                        backupNum: c.backupNum,
                        record: c.record,
                        preview:
                            c.type === "PHOTO" && c.record
                                ? `data:image/jpeg;base64,${c.record}`
                                : null,
                    }))
                    : [{ type: "PASSWORD", backupNum: 10, record: "", preview: null }]
            );
        } else {
            setFormData({
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
            setCredentials([
                { type: "PASSWORD", backupNum: 10, record: "", preview: null },
            ]);
        }
    }, [user, show, role]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "enrollId") {
            return setFormData(prev => ({
                ...prev,
                enrollId: value === "" ? "" : Number(value)
            }));
        }

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
            // Seteamos backupNum automático
            updated[index].backupNum =
                value === "PASSWORD" ? 10 : value === "CARD" ? 11 : value === "PHOTO" ? 50 : 0;

            // Si cambia a PHOTO o FINGERPRINT, no debe tener record editable manual
            if (value === "FINGERPRINT") {
                updated[index].record = ""; // se captura en dispositivo
                updated[index].preview = null;
            }
            if (value === "PHOTO") {
                // sin foto todavía: record vacío y sin preview
                if (!updated[index].record) updated[index].preview = null;
            }
        }

        setCredentials(updated);
    };

    const addCredential = () => {
        setCredentials([
            ...credentials,
            { type: "PASSWORD", backupNum: 10, record: "", preview: null },
        ]);
    };

    const removeCredential = (index) => {
        setCredentials(credentials.filter((_, i) => i !== index));
    };

    const handlePhotoSelect = async (file, index) => {
        if (!file) return;

        try {
            const { base64, preview } = await resizeToJpegBase64(file, 512, 0.85);
            const updated = [...credentials];
            updated[index].record = base64; // solo base64 puro
            updated[index].preview = preview; // dataURL para UI
            setCredentials(updated);
        } catch (err) {
            console.error("Error al procesar la imagen:", err);
            // opcional: mostrar toast/alert
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) return;
        if (role === "SA" && !formData.companyId) return;

        const finalForm = { ...formData };

        // role->adminLevel consistente
        finalForm.adminLevel = mapRoleToAdminLevel(finalForm.role);

        if (!formData.isWebUser) {
            finalForm.email = null;
            finalForm.username = null;
            finalForm.password = null;
        }

        // Sanitizar credenciales (no enviar "preview")
        const cleanCreds = credentials.map(({ preview, ...rest }) => rest);

        const finalData = {
            ...finalForm,
            companyId: Number(finalForm.companyId),
            credentials: cleanCreds,
        };

        onSave(finalData);
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static" animation={false}>
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>{formData.id ? "Editar Usuario" : "Nuevo Usuario"}</Modal.Title>
            </Modal.Header>



            <Form onSubmit={handleSubmit}>
                <Modal.Body className="bg-dark text-light">

                    <Form.Group className="mb-3">
                        <Form.Label>Enroll ID (DNI)</Form.Label>
                        <Form.Control
                            type="number"
                            name="enrollId"
                            className="bg-secondary text-light border-0"
                            value={formData.enrollId}
                            onChange={handleChange}
                            required
                        />
                        <Form.Text className="text-info">
                            Este ID debe ser único. Idealmente el DNI del usuario.
                        </Form.Text>
                    </Form.Group>

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

                            {/* CASO CREACION */}
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

                            {/* CASO EDICION */}
                            {formData.id && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña Web (opcional)</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        className="bg-secondary text-light border-0"
                                        placeholder="Dejar vacío si no desea cambiar"
                                        value={formData.password}
                                        onChange={handleChange}
                                    
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
                                setFormData((prev) => ({
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

                            {/* FOTO: subir & preview (si no hay record aún, botón; si ya hay, mostrar preview) */}
                            {cred.type === "PHOTO" && (
                                <>
                                    {!cred.record ? (
                                        <>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                id={`photoUpload-${index}`}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    await handlePhotoSelect(file, index);
                                                }}
                                            />
                                            <Button
                                                variant="outline-light"
                                                size="sm"
                                                className="mb-2"
                                                onClick={() => document.getElementById(`photoUpload-${index}`).click()}
                                            >
                                                📷 Subir Foto (512×512)
                                            </Button>
                                            {/* Opción B: sin miniatura cuando no hay foto */}
                                            <div className="text-muted">❌ No hay foto</div>
                                        </>
                                    ) : (
                                        <>
                                            {cred.preview && (
                                                <img
                                                    src={cred.preview}
                                                    alt="Foto facial"
                                                    style={{
                                                        width: 64,
                                                        height: 64,
                                                        objectFit: "cover",
                                                        borderRadius: 8,
                                                        border: "1px solid rgba(255,255,255,0.2)",
                                                        display: "block",
                                                        marginBottom: 8,
                                                    }}
                                                />
                                            )}
                                            <div className="text-success mb-2">✅ Foto almacenada</div>
                                        </>
                                    )}
                                </>
                            )}

                            {/* RECORD visible solo si no es foto ni huella */}
                            {cred.type !== "FINGERPRINT" && cred.type !== "PHOTO" && (
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

                            <Button variant="outline-danger" size="sm" onClick={() => removeCredential(index)}>
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
