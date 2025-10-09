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

  return (
    <div className="table-responsive">
      <Table striped bordered hover variant="dark" className="align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Empresa</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u, index) => (
              <tr key={u.id}>
                <td>{index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.username}</td>
                <td>{renderRole(u.adminLevel)}</td>
                <td>{u.company?.name || "Sin empresa"}</td>
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
