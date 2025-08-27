import { Table, Button } from "react-bootstrap";

export function CompanyTable({ companies, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Rubro</th>
            <th>Contacto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c, index) => (
            <tr key={c.id}>
              <td>{index + 1}</td>
              <td>{c.name}</td>
              <td>{c.industry}</td>
              <td>{c.contact}</td>
              <td>
                <Button
                  variant="light"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(c)}
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
