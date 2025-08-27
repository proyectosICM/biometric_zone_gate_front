// BiometricTable.jsx
import { Table, Button } from "react-bootstrap";

export function BiometricTable({ biometrics, onEdit, onDelete }) {
    return (
        <div className="table-responsive">
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Host</th>
                        <th>Puerto</th>
                        <th>Idioma</th>
                        <th>Volumen</th>
                        <th>Verificación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {biometrics.map((b, index) => (
                        <tr key={b.id}>
                            <td>{index + 1}</td>
                            <td>{b.deviceName}</td>
                            <td>{b.host}</td>
                            <td>{b.port}</td>
                            <td>{b.language}</td>
                            <td>{b.volume}</td>
                            <td>{b.verificationMode}</td>
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
                                    onClick={() => onDelete(b.id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
