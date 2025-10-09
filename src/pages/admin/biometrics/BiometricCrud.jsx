// BiometricCrud.jsx
import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { BiometricTable } from "./BiometricTable";
import { BiometricModal } from "./BiometricModal";
import { CustomNavbar } from "../../../components/CustomNavbar";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function BiometricCrud() {
    const navigate = useNavigate();

    const biometricsMock = [
        {
            id: 1,
            deviceName: "Entrada Principal",
            host: "192.168.1.100", 
            port: "8080",
            push: "Yes",
            language: "ES",
            volume: "7",
            antipassback: "No",
            sleep: "5 min",
            verificationMode: "Fingerprint",
            oldPassword: "admin123",
            newPassword: "nuevaClave456",
        },
    ];

    const [biometrics, setBiometrics] = useState(biometricsMock);
    const [showModal, setShowModal] = useState(false);
    const [editingBiometric, setEditingBiometric] = useState(null);

    // Guardar biométrico
    const handleSave = (bioData) => {
        if (!bioData.deviceName || !bioData.host) {
            Swal.fire({
                title: "Error",
                text: "Nombre del dispositivo y host son obligatorios",
                icon: "error",
                background: "#212529",
                color: "#fff",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (bioData.id) {
            // Editar
            setBiometrics(biometrics.map((b) => (b.id === bioData.id ? bioData : b)));
            Swal.fire({
                title: "Actualizado",
                text: "Biométrico editado correctamente",
                icon: "success",
                background: "#212529",
                color: "#fff",
                confirmButtonColor: "#198754",
            });
        } else {
            // Nuevo
            const newBio = { ...bioData, id: Date.now() };
            setBiometrics([...biometrics, newBio]);
            Swal.fire({
                title: "Agregado",
                text: "Biométrico creado correctamente",
                icon: "success",
                background: "#212529",
                color: "#fff",
                confirmButtonColor: "#198754",
            });
        }

        setShowModal(false);
        setEditingBiometric(null);
    };

    // Eliminar biométrico
    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            background: "#212529",
            color: "#fff",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
        }).then((result) => {
            if (result.isConfirmed) {
                setBiometrics(biometrics.filter((b) => b.id !== id));
                Swal.fire({
                    title: "Eliminado",
                    text: "El biométrico ha sido eliminado",
                    icon: "success",
                    background: "#212529",
                    color: "#fff",
                    confirmButtonColor: "#198754",
                });
            }
        });
    };

    return (
        <div className="g-background">
            <CustomNavbar />

            <Container className="mt-4">
                <Row className="mb-3">
                    <Col>
                        <Button variant="outline-light" className="w-100" onClick={() => navigate(-1)}>
                            <FaArrowLeft className="me-2" />
                            Atrás
                        </Button>
                    </Col>
                </Row>
                <h2 className="text-white text-center mb-4">Gestión de Biométricos</h2>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="text-light">Dispositivos Registrados</h3>
                    <Button
                        variant="outline-success"
                        onClick={() => {
                            setEditingBiometric({
                                deviceName: "",
                                host: "",
                                port: "",
                                push: "Yes",
                                language: "ES",
                                volume: "5",
                                antipassback: "No",
                                sleep: "5 min",
                                verificationMode: "Fingerprint",
                                oldPassword: "",
                                newPassword: "",
                            });
                            setShowModal(true);
                        }}
                    >
                        + Nuevo Dispositivo
                    </Button>
                </div>

                <BiometricTable
                    biometrics={biometrics}
                    onEdit={(b) => {
                        setEditingBiometric(b);
                        setShowModal(true);
                    }}
                    onDelete={handleDelete}
                />

                <BiometricModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    biometric={editingBiometric}
                    onSave={handleSave}
                />
            </Container>
        </div>
    );
}
