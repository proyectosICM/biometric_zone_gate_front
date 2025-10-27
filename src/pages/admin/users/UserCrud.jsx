import { useState } from "react";
import { Button, Col, Container, Row, Spinner, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { UserTable } from "./UserTable";
import { UserModal } from "./UserModal";
import { CustomNavbar } from "../../../components/CustomNavbar";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
    useGetAllUsersPaginated,
    useGetUsersByCompanyIdPaged,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
} from "../../../api/hooks/useUser";

import { useGetAllCompanies } from "../../../api/hooks/useCompany";

export function UserCrud() {
    const navigate = useNavigate();

    const loggedCompany = localStorage.getItem("bzg_companyId");
    const role = localStorage.getItem("bzg_role");

    const [selectedCompany, setSelectedCompany] = useState("ALL"); // 👈 filtro SA
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [direction, setDirection] = useState("desc");

    // Queries usuarios
    const allUsersQuery = useGetAllUsersPaginated(page, size, sortBy, direction);
    const companyUsersQuery = useGetUsersByCompanyIdPaged(
        selectedCompany === "ALL" ? loggedCompany : selectedCompany,
        page,
        size,
        sortBy,
        direction
    );

    // Determina qué data usar según SA o no y según selección
    const data =
        role === "SA"
            ? (selectedCompany === "ALL" ? allUsersQuery.data : companyUsersQuery.data)
            : companyUsersQuery.data;

    const isLoading =
        role === "SA"
            ? (selectedCompany === "ALL" ? allUsersQuery.isLoading : companyUsersQuery.isLoading)
            : companyUsersQuery.isLoading;

    const isError =
        role === "SA"
            ? (selectedCompany === "ALL" ? allUsersQuery.isError : companyUsersQuery.isError)
            : companyUsersQuery.isError;

    // Empresas (solo SA)
    const companiesQuery = useGetAllCompanies();
    const companies = companiesQuery.data || [];

    // Mutations
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const users = data?.content || [];
    const totalPages = data?.totalPages || 1;

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setPage(newPage);
    };

    const handleSave = async (userData) => {
        try {
            if (!userData.name) {
                Swal.fire({
                    title: "Error",
                    text: "El campo nombre es obligatorio",
                    icon: "error",
                    background: "#212529",
                    color: "#fff",
                    confirmButtonColor: "#d33",
                });
                return;
            }

            const payload = {
                ...userData,
                companyId:
                    role === "SA"
                        ? userData.companyId
                        : loggedCompany,
                credentials: userData.credentials || [],
            };

            if (userData.id) {
                await updateUser.mutateAsync({ id: userData.id, data: payload });
                Swal.fire({
                    title: "Actualizado",
                    text: "El usuario fue editado correctamente",
                    icon: "success",
                    background: "#212529",
                    color: "#fff",
                    confirmButtonColor: "#198754",
                });
            } else {
                await createUser.mutateAsync(payload);
                Swal.fire({
                    title: "Agregado",
                    text: "Usuario creado correctamente",
                    icon: "success",
                    background: "#212529",
                    color: "#fff",
                    confirmButtonColor: "#198754",
                });
            }

            setShowModal(false);
            setEditingUser(null);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo guardar el usuario",
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
                    await deleteUser.mutateAsync(id);
                    Swal.fire({
                        title: "Eliminado",
                        text: "El usuario ha sido eliminado correctamente",
                        icon: "success",
                        background: "#212529",
                        color: "#fff",
                        confirmButtonColor: "#198754",
                    });
                } catch {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo eliminar el usuario",
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
                <h5>Error al cargar usuarios</h5>
            </div>
        );
    }

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
                            <FaArrowLeft className="me-2" /> Atrás
                        </Button>
                    </Col>
                </Row>

                <h2 className="text-white text-center mb-4">Gestión de Usuarios</h2>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="text-light">Usuarios Registrados</h3>

                    {role === "SA" && (
                        <Form.Select
                            className="bg-secondary text-light border-0 me-2"
                            style={{ width: "220px" }}
                            value={selectedCompany}
                            onChange={(e) => {
                                setSelectedCompany(e.target.value);
                                setPage(0);
                            }}
                        >
                            <option value="ALL">Todas las empresas</option>
                            {companies.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </Form.Select>
                    )}

                    <Button
                        variant="outline-success"
                        onClick={() => {
                            setEditingUser({
                                name: "",
                                email: "",
                                username: "",
                                password: "",
                                adminLevel: 0,
                                enabled: true,
                                companyId: role === "SA" ? "" : loggedCompany,
                            });
                            setShowModal(true);
                        }}
                    >
                        + Nuevo Usuario
                    </Button>
                </div>

                <UserTable
                    users={users}
                    onEdit={(user) => {
                        setEditingUser(user);
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

                <UserModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    user={editingUser}
                    onSave={handleSave}
                    role={role}
                    companies={companies}
                />
            </Container>
        </div>
    );
}
