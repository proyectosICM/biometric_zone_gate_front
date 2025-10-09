import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

export function EventTypeModal({ show, onHide, eventType, onSave }) {
  const [formData, setFormData] = useState({
    id: null,
    code: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    if (eventType) {
      setFormData({
        id: eventType.id ?? null,
        code:
          eventType.code === 0 || eventType.code
            ? eventType.code
            : "",
        name: eventType.name || "",
        description: eventType.description || "",
      });
    } else {
      setFormData({ id: null, code: "", name: "", description: "" });
    }
  }, [eventType, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "code") {
      setFormData((prev) => ({
        ...prev,
        code: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" animation={false}>
      <Modal.Header closeButton className="bg-dark text-light border-secondary">
        <Modal.Title>
          {formData.id ? "Editar Tipo de Evento" : "Nuevo Tipo de Evento"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-dark text-light">
          <Form.Group className="mb-3">
            <Form.Label>Código</Form.Label>
            <Form.Control
              type="number"
              name="code"
              className="bg-secondary text-light border-0"
              value={formData.code === 0 ? 0 : formData.code || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              className="bg-secondary text-light border-0"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              className="bg-secondary text-light border-0"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button type="submit" variant="light">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
