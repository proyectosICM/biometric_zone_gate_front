import { Table, Button } from "react-bootstrap";

export function CompanyTable({ companies, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c, index) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <Button
                  variant="light"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();  
                    }
                    onEdit(c);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDelete(c.id)}
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
