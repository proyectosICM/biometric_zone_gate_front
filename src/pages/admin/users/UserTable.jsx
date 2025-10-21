import { Table, Button, Badge } from "react-bootstrap";

export function UserTable({ users, onEdit, onDelete }) {
  const renderRole = (adminLevel) => {
    switch (adminLevel) {
      case 2:
        return <Badge bg="danger">Super Usuario</Badge>;
      case 1:
        return <Badge bg="warning" text="dark">Administrador</Badge>;
      default:
        return <Badge bg="secondary">Usuario</Badge>;
    }
  };

  const renderStatus = (enabled) => {
    return enabled ? (
      <Badge bg="success">Activo</Badge>
    ) : (
      <Badge bg="danger">Inactivo</Badge>
    );
  };

  // 👇 Funciones auxiliares
  const getPasswordDevice = (credentials = []) => {
    const cred = credentials.find(c => c.type === "PASSWORD");
    return cred ? cred.record : "-";
  };

  const getCardRfid = (credentials = []) => {
    const cred = credentials.find(c => c.type === "CARD");
    return cred ? cred.record : "-";
  };

  const getFingerprintsCount = (credentials = []) => {
    return credentials.filter(c => c.type === "FINGERPRINT").length;
  };

  return (
    <div className="table-responsive">
      <Table striped bordered hover variant="dark" className="align-middle">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Empresa</th>
            <th>Password Device</th>
            <th>Card RFID</th>
            <th>Huellas</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u, index) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email || "Sin usuario web"}</td>
                <td>{u.username || "Sin usuario web"}</td>
                <td>{renderRole(u.adminLevel)}</td>
                <td>{u.company?.name || "Sin empresa"}</td>
                <td>{getPasswordDevice(u.credentials)}</td>
                <td>{getCardRfid(u.credentials)}</td>
                <td>{getFingerprintsCount(u.credentials)}</td>
                <td>{renderStatus(u.enabled)}</td>
                <td>
                  <Button
                    variant="light"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(u)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onDelete(u.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No hay usuarios registrados
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
