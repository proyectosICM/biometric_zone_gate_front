// src/pages/alerts/CompanyAlertsTable.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Container,
  Button,
  Spinner,
  Row,
  Col,
  Form,
  Alert as BsAlert,
} from "react-bootstrap";
import Swal from "sweetalert2";
import {
  FaBell,
  FaBuilding,
  FaCalendarAlt,
  FaTrash,
  FaSync,
} from "react-icons/fa";

import { CustomNavbar } from "../../components/CustomNavbar";
import { useDeleteAlert, useGetAlertsByCompanyIdPaged } from "../../api/hooks/useAlerts";

function formatDate(iso) {
  try {
    if (!iso) return "—";
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${d.toLocaleDateString()} ${hh}:${mm}`;
  } catch {
    return iso ?? "—";
  }
}

export function AlertsByCompanyTable() {
  const companyId = useMemo(() => localStorage.getItem("bzg_companyId"), []);
  const role = useMemo(() => localStorage.getItem("bzg_role"), []);

  // Estado de tabla (0-based en backend)
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState("createdAt");
  const [direction, setDirection] = useState("DESC"); // ASC | DESC

  const {
    data, // Page<AlertModel>
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAlertsByCompanyIdPaged(companyId, page, size, sort, direction);

  const { mutateAsync: deleteAlert, isLoading: isDeleting } = useDeleteAlert();

  const content = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;

  // Reset a primera página cuando cambia tamaño u orden
  useEffect(() => {
    setPage(0);
  }, [size, sort, direction]);

  const handleRefresh = () => refetch();

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar alerta?",
      text: "Esta acción no se puede deshacer.",
      background: "#1e1e1e",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;

    await deleteAlert(id);
    await refetch();

    Swal.fire({
      icon: "success",
      title: "Eliminada",
      text: "La alerta fue eliminada.",
      timer: 1400,
      showConfirmButton: false,
      background: "#1e1e1e",
      color: "#fff",
    });
  };

  return (
    <div className="g-background min-vh-100">
      {/* Navbar SIEMPRE arriba */}
      <CustomNavbar />

      <Container className="py-4">
        <h2 className="text-white text-center mb-4">
          <FaBell className="me-2" />
          Alertas por empresa
        </h2>

        {/* Estados globales dentro del Container (sin centrar el navbar) */}
        {!companyId && (
          <BsAlert variant="warning">
            No se encontró <code>bzg_companyId</code> en el localStorage. Selecciona una empresa.
          </BsAlert>
        )}

        {isError && (
          <BsAlert variant="danger" className="mb-3">
            Error al cargar alertas: {error?.message || "desconocido"}
          </BsAlert>
        )}

        {/* Header de controles (se muestra incluso si no hay registros) */}
        <Row className="align-items-center text-light mb-3">
          <Col xs="12" md="6" className="mb-2 mb-md-0">
            <strong>Empresa:</strong>{" "}
            <span className="text-info">{companyId || "—"}</span>
            <span className="ms-3">
              <strong>Total:</strong> {totalElements}{" "}
              {isFetching && <Spinner animation="border" size="sm" className="ms-2" />}
            </span>
          </Col>
          <Col xs="12" md="6" className="d-flex justify-content-md-end">
            <div className="d-flex gap-2">
              <Form.Select
                size="sm"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                style={{ width: 140 }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} por página
                  </option>
                ))}
              </Form.Select>

              <Form.Select
                size="sm"
                value={`${sort}:${direction}`}
                onChange={(e) => {
                  const [s, d] = e.target.value.split(":");
                  setSort(s);
                  setDirection(d);
                }}
                style={{ width: 210 }}
              >
                <option value="createdAt:DESC">Creación ↓</option>
                <option value="createdAt:ASC">Creación ↑</option>
                <option value="title:ASC">Título A→Z</option>
                <option value="title:DESC">Título Z→A</option>
              </Form.Select>

              <Button
                variant="outline-light"
                size="sm"
                onClick={handleRefresh}
                disabled={isFetching || isLoading}
              >
                <FaSync className="me-2" />
                Refrescar
              </Button>
            </div>
          </Col>
        </Row>

        {/* Contenido principal (altura mínima para evitar “salto” del layout) */}
        <div style={{ minHeight: "60vh" }}>
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
              <Spinner animation="border" variant="light" />
              <span className="text-light ms-3">Cargando alertas...</span>
            </div>
          ) : (
            <div className="table-responsive rounded overflow-hidden shadow mb-4">
              <Table striped bordered hover variant="dark" className="align-middle mb-0">
                <thead className="table-dark text-center">
                  <tr>
                    <th><FaBell className="me-1" /> Título</th>
                    <th>Descripción</th>
                    {role === "SA" && (
                      <th><FaBuilding className="me-1 text-warning" /> Empresa</th>
                    )}
                    <th>
                      <FaCalendarAlt className="me-1" /> Creado
                    </th>
                    <th style={{ width: 120 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {content.length > 0 ? (
                    content.map((a) => (
                      <tr key={a.id} className="text-center">
                        <td style={{ maxWidth: 280 }}>
                          <strong>{a.title ?? "—"}</strong>
                        </td>
                        <td
                          style={{
                            maxWidth: role === "SA" ? 420 : 520,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={a.description ?? ""}
                        >
                          {a.description ?? "—"}
                        </td>
                        {role === "SA" && <td>{a.company?.name || "—"}</td>}
                        <td>{formatDate(a.createdAt)}</td>
                        <td className="text-center">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(a.id)}
                            disabled={isDeleting}
                          >
                            <FaTrash className="me-2" />
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={role === "SA" ? 5 : 4} className="text-center text-secondary py-5">
                        No hay alertas para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        {/* Paginación simple */}
        <div className="d-flex justify-content-between align-items-center text-light">
          <Button
            variant="outline-light"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </Button>
          <span>
            Página {page + 1} de {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline-light"
            size="sm"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </Button>
        </div>
      </Container>
    </div>
  );
}
