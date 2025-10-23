import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import {
    useSyncDeviceTimeCustom, useSyncDeviceTimeNow, useCleanAdmins, useCleanDeviceLogs, useRebootDevice,
    useInitializeSystem
} from "../../../api/hooks/useDevice";
import Swal from "sweetalert2";
import { useState } from "react";

export function BiometricTable({ biometrics, onEdit, onDelete, onManageUsers, onOpenDoor }) {
    const role = localStorage.getItem("bzg_role");


    const [showAdvancedModal, setShowAdvancedModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    // Hooks de funciones avanzadas
    const syncTimeNow = useSyncDeviceTimeNow();
    const syncTimeCustom = useSyncDeviceTimeCustom();
    const cleanAdmins = useCleanAdmins();
    const cleanLogs = useCleanDeviceLogs();
    const rebootDevice = useRebootDevice();
    const initializeSystem = useInitializeSystem();

    const handleAction = async (action, id, extra = null) => {
        try {
            if (action === "syncNow") await syncTimeNow.mutateAsync(id);
            if (action === "syncCustom") await syncTimeCustom.mutateAsync({ id, datetime: extra });
            if (action === "cleanAdmins") await cleanAdmins.mutateAsync(id);
            if (action === "cleanLogs") await cleanLogs.mutateAsync(id);
            if (action === "initializeSystem") await initializeSystem.mutateAsync(id);

            Swal.fire({
                title: "Éxito",
                text: "Acción ejecutada correctamente",
                icon: "success",
                background: "#212529",
                color: "#fff",
                confirmButtonColor: "#198754",
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo ejecutar la acción",
                icon: "error",
                background: "#212529",
                color: "#fff",
                confirmButtonColor: "#d33",
            });
        }
    };

    const handleCustomTime = async () => {
        const { value: datetime } = await Swal.fire({
            title: "Asignar hora personalizada",
            html: `
        <input type="datetime-local" id="datetime" class="swal2-input" />
      `,
            background: "#212529",
            color: "#fff",
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Asignar",
            cancelButtonText: "Cancelar",
            preConfirm: () => document.getElementById("datetime").value,
        });

        if (datetime) {
            await handleAction("syncCustom", selectedDevice.id, datetime);
        }
    };

    return (
        <div className="table-responsive">
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>SN</th>
                        <th>Nombre</th>
                        <th>Empresa</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {biometrics.map((b, index) => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.sn}</td>
                            <td>{b.name}</td>
                            <td>{b.company?.name || "—"}</td>
                            <td>
                                <Button
                                    variant="light"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onEdit(b)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onDelete(b.id)}
                                >
                                    Eliminar
                                </Button>
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onOpenDoor(b.id)}
                                >
                                    Abrir puerta
                                </Button>
                                <Button
                                    variant="info"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onManageUsers(b.id)}
                                >
                                    Modificar lista de usuarios permitidos
                                </Button>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleAction("reboot", b.id)}
                                >
                                    Reiniciar dispositivo
                                </Button>

                                {role === "SA" && (
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedDevice(b);
                                            setShowAdvancedModal(true);
                                        }}
                                    >
                                        Funciones avanzadas
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* MODAL FUNCIONES AVANZADAS */}
            <Modal
                show={showAdvancedModal}
                onHide={() => setShowAdvancedModal(false)}
                centered
            >
                <Modal.Header closeButton className="bg-dark text-light border-secondary">
                    <Modal.Title>Funciones avanzadas - {selectedDevice?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    <Row className="text-center">
                        <Col xs={12} className="mb-3">
                            <Button
                                variant="outline-light"
                                className="w-100 p-2"
                                onClick={() => handleAction("syncNow", selectedDevice.id)}
                            >
                                Asignar hora actual al dispositivo
                            </Button>
                        </Col>

                        <Col xs={12} className="mb-3">
                            <Button
                                variant="outline-light"
                                className="w-100 p-2"
                                onClick={handleCustomTime}
                            >
                                Asignar hora personalizada
                            </Button>
                        </Col>

                        <Col xs={12} className="mb-3">
                            <Button
                                variant="outline-danger"
                                className="w-100 p-2"
                                onClick={() => handleAction("cleanAdmins", selectedDevice.id)}
                            >
                                Limpiar todos los administradores
                            </Button>
                        </Col>

                        <Col xs={12} className="mb-3">
                            <Button
                                variant="outline-danger"
                                className="w-100 p-2"
                                onClick={() => handleAction("cleanLogs", selectedDevice.id)}
                            >
                                Limpiar logs del dispositivo
                            </Button>
                        </Col>

                        {/* Aquí podrás agregar más funciones en el futuro */}
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    );
}