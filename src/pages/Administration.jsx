import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CustomNavbar } from "../components/CustomNavbar";
import { FaUsers, FaBuilding, FaFingerprint, FaListAlt } from "react-icons/fa";

export function Administration() {
  const navigate = useNavigate();

  const role = localStorage.getItem("bzg_role");

  const cards = [
    {
      title: "Usuarios",
      icon: <FaUsers size={40} />,
      description: "Gestiona los usuarios del sistema",
      route: "/users",
    },
    {
      title: "Empresas",
      icon: <FaBuilding size={40} />,
      description: "Administra las empresas registradas",
      route: "/companies",
      requiresSA: true,
    },
    {
      title: "Biométricos",
      icon: <FaFingerprint size={40} />,
      description: "Configura los dispositivos biométricos",
      route: "/biometrics",
    },
    {
      title: "Tipos de Evento",
      icon: <FaListAlt size={40} />,
      description: "Gestiona los tipos de eventos de acceso",
      route: "/event-types",
      requiresSA: true,
    },
  ];

  const visibleCards = cards.filter(
    (card) => !card.requiresSA || role === "SA"
  );

  return (
    <div className="g-background">
      <CustomNavbar />
      <Container className="mt-4">
        <h2 className="text-white mb-4">Administración</h2>
        <Row>
          {visibleCards.map((card, idx) => (
            <Col key={idx} md={4} className="mb-4">
              <Card
                className="h-100 shadow text-center text-white"
                bg="dark"
                onClick={() => navigate(card.route)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <div className="mb-3">{card.icon}</div>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text>{card.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
