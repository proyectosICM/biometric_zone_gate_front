import { useState } from "react";
import { Table, Button, Badge, Image, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

export function UserTable({ users, onEdit, onDelete }) {

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const downloadImage = (base64, fileName = "foto_facial.jpg") => {
    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${base64}`;
    link.download = fileName;
    link.click();
  };

  // ========= helpers
  const renderRole = (adminLevel) => {
    switch (adminLevel) {
      case 2: return <Badge bg="danger">Super Usuario</Badge>;
      case 1: return <Badge bg="warning" text="dark">Administrador</Badge>;
      default: return <Badge bg="secondary">Usuario</Badge>;
    }
  };

  const renderStatus = (enabled) =>
    enabled ? <Badge bg="success">Activo</Badge> : <Badge bg="danger">Inactivo</Badge>;

  const getPasswordDevice = (creds = []) => {
    const c = creds.find(c => c.type === "PASSWORD");
    return c ? c.record : "-";
  };

  const getCardRfid = (creds = []) => {
    const c = creds.find(c => c.type === "CARD");
    return c ? c.record : "-";
  };

  const getFingerprintsCount = (creds = []) =>
    creds.filter(c => c.type === "FINGERPRINT").length;

  const getFacialImage = (creds = []) => {
    const c = creds.find(c => c.type === "PHOTO");
    return c ? `data:image/jpeg;base64,${c.record}` : null;
  };

  return (
    <div className="table-responsive">
      <Table striped bordered hover variant="dark" className="align-middle">
        <thead>
        <tr>
          <th>Id</th>
          <th>EnrollId</th> 
          <th>Nombre</th>
          <th>Email</th>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Empresa</th>
          <th>Password</th>
          <th>Tarjeta</th>
          <th>Huellas</th>
          <th>Facial</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        {users.length > 0 ? (
          users.map((u) => {
            const facialImg = getFacialImage(u.credentials);

            return (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.enrollId || "-"}</td>
                <td>{u.name}</td>
                <td>{u.email || "Sin usuario web"}</td>
                <td>{u.username || "Sin usuario web"}</td>
                <td>{renderRole(u.adminLevel)}</td>
                <td>{u.companyName || u.companyId || "Sin empresa"}</td>
                <td>{getPasswordDevice(u.credentials)}</td>
                <td>{getCardRfid(u.credentials)}</td>
                <td>{getFingerprintsCount(u.credentials)}</td>
                <td>
                  {facialImg ? (
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id={`tooltip-${u.id}`}>
                          <Image
                            src={facialImg}
                            style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px" }}
                          />
                        </Tooltip>
                      }
                    >
                      <Image
                        src={facialImg}
                        roundedCircle
                        style={{ width: 40, height: 40, objectFit: "cover", cursor: "pointer" }}
                        onClick={() => openModal(u)}
                      />
                    </OverlayTrigger>
                  ) : "❌"}
                </td>
                <td>{renderStatus(u.enabled)}</td>
                <td>
                  <Button variant="light" size="sm" className="me-2" onClick={() => onEdit(u)}>
                    Editar
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onDelete(u.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="12" className="text-center text-muted">No hay usuarios registrados</td>
          </tr>
        )}
        </tbody>
      </Table>

      {/* ======== MODAL FACIAL ========= */}
      {selectedUser && (
        <Modal show={showModal} onHide={closeModal} centered size="lg" backdrop="static">
          <Modal.Header closeButton className="bg-dark text-light border-secondary">
            <Modal.Title>Foto Facial - {selectedUser.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-center">
            <Image
              src={getFacialImage(selectedUser.credentials)}
              style={{ maxHeight: "65vh", maxWidth: "100%", borderRadius: "10px" }}
            />
          </Modal.Body>
          <Modal.Footer className="bg-dark border-secondary">
            <Button
              variant="outline-light"
              onClick={() => downloadImage(
                selectedUser.credentials.find(c => c.type === "PHOTO").record,
                `facial_${selectedUser.id}.jpg`
              )}
            >
              Descargar Foto
            </Button>
            <Button variant="secondary" onClick={closeModal}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
