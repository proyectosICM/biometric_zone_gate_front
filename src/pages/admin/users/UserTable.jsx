import { Container, Table, Button, Spinner } from "react-bootstrap";
import { CustomNavbar } from "../../../components/CustomNavbar";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useGetAllUsers } from "../../../hooks/userHooks"; // Asegúrate de tener este hook

export function UserTable() {
  const { data: users, isLoading, isError } = useGetAllUsers();

  return (
    <div className="g-background">
      <CustomNavbar />
      <Container className="mt-4">
        <h2 className="text-white mb-4">Usuarios Registrados</h2>

        {isLoading ? (
          <div className="text-center text-white">
            <Spinner animation="border" variant="light" />
            <p>Cargando usuarios...</p>
          </div>
        ) : isError ? (
          <p className="text-danger">Error al cargar los usuarios.</p>
        ) : (
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario (Card #)</th>
                <th>Rol</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.cardNumber}</td>
                  <td>{user.privilege === 1 ? "Administrador" : "Usuario"}</td>
                  <td>
                    <Button variant="outline-light" size="sm" className="me-2">
                      <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
}
