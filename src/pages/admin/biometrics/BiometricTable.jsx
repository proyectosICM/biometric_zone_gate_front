import { Table, Button } from "react-bootstrap";

const languageMap = {
    0: "English",
    9: "Spanish",
};

const antiPassbackMap = {
    0: "Deshabilitado",
    1: "Host Inside",
    2: "Host Outside",
};

const verificationModeMap = {
    0: "FP o Card o Pwd",
    1: "Card + FP",
    2: "Pwd + FP",
    3: "Card + FP + Pwd",
    4: "Card + Pwd",
};

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
                        <th>Anti-passback</th>
                        <th>Sueño</th>
                        <th>Verificación</th>
                        <th>Push</th>
                        <th>Empresa</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {biometrics.map((b, index) => (
                        <tr key={b.id}>
                            <td>{index + 1}</td>
                            <td>{b.name}</td>
                            <td>{b.host}</td>
                            <td>{b.port}</td>
                            <td>{languageMap[b.language] || b.language}</td>
                            <td>{b.volume}</td>
                            <td>{antiPassbackMap[b.antiPassback] || b.antiPassback}</td>
                            <td>{b.sleepEnabled ? "Sí" : "No"}</td>
                            <td>{verificationModeMap[b.verificationMode] || b.verificationMode}</td>
                            <td>{b.pushEnabled ? "Sí" : "No"}</td>
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
