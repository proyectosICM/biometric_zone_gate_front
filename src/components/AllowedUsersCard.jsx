// src/components/AllowedUsersCard.jsx
import { Card, Table, Button } from "react-bootstrap";

export function AllowedUsersCard({ users, onEdit }) {
  return (
    <Card bg="dark" text="light" className="shadow-lg">
      <Card.Header className="text-center fs-4">Usuarios Permitidos</Card.Header>
      <Card.Body className="table-responsive">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Modo de autenticación</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.authMode}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="text-end mt-3">
          <Button variant="outline-light" onClick={onEdit}>
            Modificar lista de usuarios permitidos
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
