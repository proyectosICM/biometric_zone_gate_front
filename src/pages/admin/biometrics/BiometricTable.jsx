import { Button, Table } from "react-bootstrap";

export function BiometricTable({ biometrics, onEdit, onDelete, onManageUsers }) {
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
                            <td>{index + 1}</td>
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
                                    onClick={() => onDelete(b.id)}
                                >
                                    Eliminar
                                </Button>
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => onManageUsers(b.id)}
                                >
                                    Modificar lista de usuarios permitidos
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
