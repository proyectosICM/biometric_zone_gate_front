import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { CompanyTable } from "./CompanyTable";
import { CompanyModal } from "./CompanyModal";
import { CustomNavbar } from "../../../components/CustomNavbar";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function CompanyCrud() {
    const navigate = useNavigate();

    const companiesMock = [
        { id: 1, name: "TechCorp", industry: "Tecnología", contact: "soporte@techcorp.com" },
        { id: 2, name: "GreenFoods", industry: "Alimentos", contact: "ventas@greenfoods.com" },
        { id: 3, name: "BuildCo", industry: "Construcción", contact: "contacto@buildco.com" },
    ];

    const [companies, setCompanies] = useState(companiesMock);
    const [showModal, setShowModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    // Guardar empresa
    const handleSave = (companyData) => {
        if (!companyData.name || !companyData.contact) {
            Swal.fire({
                title: "Error",
                text: "Todos los campos son obligatorios",
                icon: "error",
                background: "#212529",
                color: "#fff",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (companyData.id) {
            // Editar
            setCompanies(companies.map((c) => (c.id === companyData.id ? companyData : c)));
            Swal.fire({
                title: "Actualizado",
                text: "Empresa editada correctamente",
                icon: "success",
                background: "#212529",
                color: "#fff",
                confirmButtonColor: "#198754", // verde bootstrap
            });
        } else {
            // Agregar nuevo
            const newCompany = { ...companyData, id: Date.now() };
            setCompanies([...companies, newCompany]);
            Swal.fire({
                title: "Agregado",
                text: "Empresa creada correctamente",
                icon: "success",
                background: "#212529",
                color: "#fff",
                confirmButtonColor: "#198754",
            });
        }

        setShowModal(false);
        setEditingCompany(null);
    };

    // Eliminar empresa
    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            background: "#212529",
            color: "#fff",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
        }).then((result) => {
            if (result.isConfirmed) {
                setCompanies(companies.filter((c) => c.id !== id));
                Swal.fire("Eliminado", "La empresa ha sido eliminada", "success");
            }
        });
    };

    return (
        <div className="g-background">
            <CustomNavbar />

            <Container className="mt-4">
                <Row className="mb-3">
                    <Col>
                        <Button variant="outline-light" className="w-100" onClick={() => navigate(-1)}>
                            <FaArrowLeft className="me-2" />
                            Atrás
                        </Button>
                    </Col>
                </Row>
                <h2 className="text-white text-center mb-4">Gestión de Empresas</h2>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="text-light">Empresas Registradas</h3>
                    <Button
                        variant="outline-success"
                        onClick={() => {
                            setEditingCompany({ name: "", industry: "", contact: "" });
                            setShowModal(true);
                        }}
                    >
                        + Nueva Empresa
                    </Button>
                </div>

                <CompanyTable
                    companies={companies}
                    onEdit={(company) => {
                        setEditingCompany(company);
                        setShowModal(true);
                    }}
                    onDelete={handleDelete}
                />

                <CompanyModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    company={editingCompany}
                    onSave={handleSave}
                />
            </Container>
        </div>
    );
}
