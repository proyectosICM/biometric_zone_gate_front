import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

export function DeviceConfiguration() {
  const [deviceName, setDeviceName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [zone, setZone] = useState("");
  const [tempThreshold, setTempThreshold] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const configData = {
      name: deviceName,
      ip: ipAddress,
      zone,
      temperatureLimit: tempThreshold,
    };
    console.log("Configuración enviada:", configData);
    // Aquí puedes hacer una petición POST/PUT al backend
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg">
            <Card.Header as="h4" className="bg-dark text-white">
              Configuración del Dispositivo
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="deviceName" className="mb-3">
                  <Form.Label>Nombre del Dispositivo</Form.Label>
                  <Form.Control
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="Ej. Biométrico Zona 1"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="ipAddress" className="mb-3">
                  <Form.Label>Dirección IP</Form.Label>
                  <Form.Control
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="Ej. 192.168.0.10"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="zone" className="mb-3">
                  <Form.Label>Zona Asignada</Form.Label>
                  <Form.Control
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Ej. Zona A, Zona de Frío, etc."
                    required
                  />
                </Form.Group>

                <Form.Group controlId="tempThreshold" className="mb-4">
                  <Form.Label>Umbral de Temperatura (°C)</Form.Label>
                  <Form.Control
                    type="number"
                    value={tempThreshold}
                    onChange={(e) => setTempThreshold(e.target.value)}
                    placeholder="Ej. 5.0"
                    required
                  />
                </Form.Group>

                <Button variant="dark" type="submit" className="w-100">
                  Guardar Configuración
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
