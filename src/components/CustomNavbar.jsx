import React, { useEffect } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { FaClipboardList, FaHome, FaSignOutAlt, FaTachometerAlt, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function CustomNavbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("bzg_role");
  const token = localStorage.getItem("bzg_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand style={{ marginLeft: "25px", cursor: "pointer" }} onClick={() => navigate("/")}>
        <FaHome /> Inicio
      </Navbar.Brand>

      {/* Toggle button for mobile view */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      {/* Collapsible nav items */}
      <Navbar.Collapse id="basic-navbar-nav">
        {/* Centering the navigation links */}
        <Nav className="mx-auto">
          <Nav.Link onClick={() => navigate("/")} style={{ borderBottom: "none", textDecoration: "none" }}>
            <FaTachometerAlt style={{ marginRight: "5px" }} /> Panel Principal
          </Nav.Link>
          {/*<Nav.Link onClick={() => navigation("/observations")} style={{ borderBottom: "none", textDecoration: "none" }}>
            <FaClipboardList style={{ marginRight: "5px" }} /> Observacioness
          </Nav.Link>*/}
          <Nav.Link onClick={() => navigate("/user-access")} style={{ borderBottom: "none", textDecoration: "none" }}>
            <FaClipboardList style={{ marginRight: "5px" }} /> Acesos de usuarios
          </Nav.Link>
          {/* <Nav.Link onClick={() => navigation("/records-panel")}>Panel Registros</Nav.Link> */}
          <Nav.Link onClick={() => navigate("/administracion")} style={{ borderBottom: "none", textDecoration: "none" }}>
            <FaUserShield style={{ marginRight: "5px" }} /> Administración
          </Nav.Link>
        </Nav>

        {/* Right-aligned logout button */}
        <Button style={{ marginRight: "25px" }} onClick={handleLogout} variant="outline-light">
          <FaSignOutAlt /> Cerrar Sesión
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
}
