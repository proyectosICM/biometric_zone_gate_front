import { Table, Button } from "react-bootstrap";

export function EventTypeTable({ eventTypes, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventTypes.length > 0 ? (
            eventTypes.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.code}</td>
                <td>{e.name}</td>
                <td>{e.description}</td>
                <td>
                  <Button
                    variant="light"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                      onEdit(e);
                    }}
                  >
                    Editar
                  </Button>
           {/*       <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onDelete(e.id)}
                  >
                    Eliminar
                  </Button>*/}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-light">
                No hay tipos de evento registrados
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
