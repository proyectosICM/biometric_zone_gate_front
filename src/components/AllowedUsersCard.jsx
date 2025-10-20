import { Card, Table, Button } from "react-bootstrap";
import { getDateAndDayFromTimestamp } from "../utils/formatDate";

export function AllowedUsersCard({ usersPage, onEdit }) {
  const users = usersPage?.content || [];

  return (
    <Card bg="dark" text="light" className="shadow-lg">
      <Card.Header className="text-center fs-4">Usuarios Permitidos</Card.Header>
      <Card.Body className="table-responsive">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th> 
              <th>Username</th>
              <th>Habilitado</th>
              <th>Semana/Zona</th>
              <th>Grupo</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Dispositivo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item, index) => {
              const startDate = item.startTime
                ? getDateAndDayFromTimestamp(item.startTime)
                : "—";
              const endDate = item.endTime
                ? getDateAndDayFromTimestamp(item.endTime)
                : "—";

              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name || "—"}</td>
                  <td>{item.userName || "—"}</td>
                  <td>{item.enabled ? "Sí" : "No"}</td>
                  <td>{item.weekZone || "—"}</td>
                  <td>{item.groupNumber || "—"}</td>
                  <td>{startDate}</td>
                  <td>{endDate}</td>
                  <td>{item.deviceName || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* Aquí podrías agregar botones de paginación usando usersPage.number, usersPage.totalPages, etc. */}

        <div className="text-end mt-3">
          <Button variant="outline-light" onClick={onEdit}>
            Modificar lista de usuarios permitidos
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
