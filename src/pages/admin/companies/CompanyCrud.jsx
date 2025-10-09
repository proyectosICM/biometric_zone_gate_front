import { useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { CompanyTable } from "./CompanyTable";
import { CompanyModal } from "./CompanyModal";
import { CustomNavbar } from "../../../components/CustomNavbar";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
    useGetAllCompaniesPaginated,
    useCreateCompany,
    useUpdateCompany,
    useDeleteCompany,
} from "../../../api/hooks/useCompany";

export function CompanyCrud() {
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sortBy, setSortBy] = useState("name");
    const [direction, setDirection] = useState("asc");

    const { data, isLoading, isError } = useGetAllCompaniesPaginated(
        page,
        size,
        sortBy,
        direction
    );

    const createCompany = useCreateCompany();
    const updateCompany = useUpdateCompany();
    const deleteCompany = useDeleteCompany();

    const [showModal, setShowModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    const companies = data?.content || [];
    const totalPages = data?.totalPages || 1;

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setPage(newPage);
    };

    const handleSave = async (companyData) => {
        try {
            if (!companyData.name) {
                Swal.fire({
                    title: "Error",
                    text: "El nombre de la empresa es obligatorio",
                    icon: "error",
                    background: "#212529",
                    color: "#fff",
                    confirmButtonColor: "#d33",
                });
                return;
            }

            if (companyData.id) {
                await updateCompany.mutateAsync({
                    id: companyData.id,
                    data: companyData,
                });
                Swal.fire({
                    title: "Actualizado",
                    text: "La empresa fue editada correctamente",
                    icon: "success",
                    background: "#212529",
                    color: "#fff",
                    confirmButtonColor: "#198754",
                });
            } else {
                await createCompany.mutateAsync(companyData);
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
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo guardar la empresa",
                icon: "error",
                background: "#212529",
                color: "#fff",
                confirmButtonColor: "#d33",
            });
        }
    };

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
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteCompany.mutateAsync(id);
                    Swal.fire({
                        title: "Eliminado",
                        text: "La empresa ha sido eliminada correctamente",
                        icon: "success",
                        background: "#212529",
                        color: "#fff",
                        confirmButtonColor: "#198754",
                    });
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo eliminar la empresa",
                        icon: "error",
                        background: "#212529",
                        color: "#fff",
                        confirmButtonColor: "#d33",
                    });
                }
            }
        });
    };

    if (isLoading) {
        return (
            <div className="g-background d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="light" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-danger mt-5">
                <h5>Error al cargar empresas</h5>
            </div>
        );
    }

    const clearFocus = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    return (
        <div className="g-background">
            <CustomNavbar />

            <Container className="mt-4">
                <Row className="mb-3">
                    <Col>
                        <Button
                            variant="outline-light"
                            className="w-100"
                            onClick={() => navigate(-1)}
                        >
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
                            clearFocus();
                            setEditingCompany({ name: "" });
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

                <div className="d-flex justify-content-center mt-3">
                    <Button
                        variant="outline-light"
                        className="me-2"
                        disabled={page === 0}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        ← Anterior
                    </Button>
                    <span className="text-light align-self-center">
                        Página {page + 1} de {totalPages}
                    </span>
                    <Button
                        variant="outline-light"
                        className="ms-2"
                        disabled={page + 1 >= totalPages}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Siguiente →
                    </Button>
                </div>

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
