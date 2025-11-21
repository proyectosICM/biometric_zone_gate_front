import React, { useState } from "react";
import {
  Table,
  Container,
  Button,
  Modal,
  Row,
  Col,
  Spinner,
  Stack,
  Image,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CustomNavbar } from "../components/CustomNavbar";
import Swal from "sweetalert2";

import {
  FaUsers,
  FaUser,
  FaBuilding,
  FaEye,
  FaDownload,
  FaStickyNote,
  FaTools,
  FaIdBadge,
  FaSignInAlt,
  FaSignOutAlt,
  FaHourglassHalf,
  FaHardHat,
  FaCheckCircle,
  FaMicrochip,
  FaBolt,
  FaTimesCircle,
  FaCamera,
} from "react-icons/fa";

import { useGetUsersByCompanyIdPaged } from "../api/hooks/useUser";
import { useGetLogsByCompanyPaginated } from "../api/hooks/useAccessLogs";
import {
  formatSecondsToHHMMSS,
  getDateAndDayFromTimestamp,
} from "../utils/formatDate";

export function UserAccessList() {
  const companyId = localStorage.getItem("bzg_companyId");
  const role = localStorage.getItem("bzg_role");
  const navigate = useNavigate();

  // Paginación de usuarios
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Paginación de logs
  const [logPage, setLogPage] = useState(0);
  const [logSize] = useState(10);

  // Modal descarga (por ahora solo dummy)
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Modal foto EPP
  const [photoModalB64, setPhotoModalB64] = useState(null);
  const [photoModalTitle, setPhotoModalTitle] = useState("Foto EPP");

  // Fetch usuarios
  const { data, isLoading, isError } = useGetUsersByCompanyIdPaged(
    companyId,
    page,
    size,
    "id",
    "asc"
  );

  // Fetch logs
  const {
    data: logsData,
    isLoading: isLoadingLogs,
    isError: isErrorLogs,
  } = useGetLogsByCompanyPaginated(
    companyId,
    logPage,
    logSize,
    "createdAt",
    "desc"
  );

  const users = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const companyLogs = logsData?.content || [];
  const totalLogPages = logsData?.totalPages || 1;

  const handleViewClick = (userId) => navigate(`/user-access/${userId}`);

  const handleDownloadClick = (range) => {
    setShowDownloadModal(false);
    Swal.fire({
      icon: "info",
      title: "Descarga iniciada",
      text: `Descargando registros (${range}).`,
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#198754",
    });
  };

  // ---------- Helpers foto base64 ----------
  const guessMime = (b64 = "") => {
    if (b64.startsWith("/9j")) return "image/jpeg"; // JPEG
    if (b64.startsWith("iVBOR")) return "image/png"; // PNG
    if (b64.startsWith("R0lGOD")) return "image/gif"; // GIF
    return "image/jpeg";
  };

  const toDataUrl = (b64) => `data:${guessMime(b64)};base64,${b64}`;

  const openPhoto = (b64, title = "Foto EPP") => {
    if (!b64) return;
    setPhotoModalB64(b64);
    setPhotoModalTitle(title);
  };

  const closePhoto = () => {
    setPhotoModalB64(null);
    setPhotoModalTitle("Foto EPP");
  };

  const downloadBase64Image = (b64, fileName = "foto_epp.jpg") => {
    if (!b64) return;
    const a = document.createElement("a");
    a.href = toDataUrl(b64);
    a.download = fileName;
    a.click();
  };

  // ===== Loading / error de usuarios =====
  if (isLoading)
    return (
      <div className="g-background min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <CustomNavbar />
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-3">Cargando usuarios...</p>
      </div>
    );

  if (isError)
    return (
      <div className="g-background min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <CustomNavbar />
        <p className="text-danger">Error al cargar usuarios.</p>
      </div>
    );

  // Colspan dinámico para “No hay registros…”
  const userColSpan = role === "SA" ? 5 : 4;
  // +1 columna por Foto EPP
  const logColSpan = role === "SA" ? 11 : 10;

  return (
    <div className="g-background min-vh-100">
      <CustomNavbar />
      <Container className="py-4">
        {/* Título principal */}
        <h2 className="text-white text-center mb-4">
          <FaUsers className="me-2" />
          Acceso de zonas por usuario
        </h2>

        <p className="text-center text-light mb-4">
          Selecciona un usuario para ver su historial de accesos.
        </p>

        {/* ================= TABLA USUARIOS (DESKTOP + MOBILE) ================= */}
        <div className="table-responsive rounded overflow-hidden shadow mb-5">
          <Table
            striped
            bordered
            hover
            variant="dark"
            className="align-middle mb-0"
          >
            <thead className="table-dark text-center">
              <tr>
                <th>
                  <FaIdBadge className="me-1" />
                  ID
                </th>
                <th>
                  <FaUser className="me-1" />
                  Nombre
                </th>
                <th>
                  <FaUsers className="me-1 text-secondary" />
                  Usuario
                </th>
                {role === "SA" && (
                  <th>
                    <FaBuilding className="me-1 text-warning" /> Empresa
                  </th>
                )}
                <th>
                  <FaTools className="me-1" />
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="text-center">
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.username || "Sin usuario web"}</td>
                    {role === "SA" && <td>{user.companyName || "—"}</td>}
                    <td>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => handleViewClick(user.id)}
                      >
                        <FaEye className="me-2" />
                        Ver accesos
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={userColSpan}
                    className="text-center text-secondary py-4"
                  >
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Paginación usuarios */}
        <div className="d-flex justify-content-between align-items-center text-light mb-5">
          <Button
            variant="outline-light"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </Button>
          <span>
            Página {page + 1} de {totalPages}
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

        {/* ================= ACCESOS GENERALES ================= */}
        <h3 className="text-white mb-3">
          <FaStickyNote className="me-2" />
          Accesos generales
        </h3>

        {isLoadingLogs ? (
          <div className="text-center text-light my-5">
            <Spinner animation="border" variant="light" />
            <p>Cargando accesos...</p>
          </div>
        ) : isErrorLogs ? (
          <div className="text-center text-danger my-4">
            Error al cargar los registros.
          </div>
        ) : (
          <>
            {/* ===== Vista DESKTOP/TABLET (md+) - Tabla ===== */}
            <div className="d-none d-md-block">
              <div className="table-responsive rounded overflow-hidden shadow">
                <Table
                  striped
                  bordered
                  hover
                  variant="dark"
                  className="align-middle mb-0"
                >
                  <thead className="table-dark text-center">
                    <tr>
                      <th>
                        <FaUser className="me-1" />
                        Usuario
                      </th>
                      <th>
                        <FaMicrochip className="me-1" /> Dispositivo
                      </th>
                      {role === "SA" && (
                        <th>
                          <FaBuilding className="me-1" /> Empresa
                        </th>
                      )}
                      <th>
                        <FaBolt className="me-1" /> Evento
                      </th>
                      <th>
                        <FaSignInAlt className="me-1 text-success" /> Entrada
                      </th>
                      <th>
                        <FaSignOutAlt className="me-1 text-danger" /> Salida
                      </th>
                      <th>
                        <FaHourglassHalf className="me-1" /> Duración
                      </th>
                      <th>
                        <FaHardHat className="me-1 text-warning" /> EPP
                      </th>
                      <th>
                        <FaCamera className="me-1" /> Foto EPP
                      </th>
                      <th>
                        <FaCheckCircle className="me-1 text-success" /> Éxito
                      </th>
                      <th>
                        <FaStickyNote className="me-1" /> Observación
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyLogs.length > 0 ? (
                      companyLogs.map((log) => (
                        <tr key={log.id} className="text-center">
                          <td>{log.user?.name || "Desconocido"}</td>
                          <td>{log.device?.name || "N/A"}</td>
                          {role === "SA" && (
                            <td>{log.company?.name || "—"}</td>
                          )}
                          <td>{log.eventType?.name || "—"}</td>
                          <td>
                            {log.entryTime
                              ? getDateAndDayFromTimestamp(log.entryTime)
                              : "—"}
                          </td>
                          <td>
                            {log.exitTime
                              ? getDateAndDayFromTimestamp(log.exitTime)
                              : "—"}
                          </td>
                          <td>
                            {log.durationSeconds
                              ? formatSecondsToHHMMSS(log.durationSeconds)
                              : "—"}
                          </td>
                          <td
                            className={
                              log.correctEpp ? "text-success" : "text-danger"
                            }
                          >
                            {log.correctEpp ? "Sí" : "No"}
                          </td>
                          <td>
                            {log.entryEppPhotoB64 ? (
                              <OverlayTrigger
                                placement="right"
                                overlay={
                                  <Tooltip id={`tt-epp-${log.id}`}>
                                    <Image
                                      src={toDataUrl(log.entryEppPhotoB64)}
                                      style={{
                                        width: 120,
                                        height: 120,
                                        objectFit: "cover",
                                        borderRadius: 10,
                                      }}
                                    />
                                  </Tooltip>
                                }
                              >
                                <Image
                                  src={toDataUrl(log.entryEppPhotoB64)}
                                  roundedCircle
                                  style={{
                                    width: 40,
                                    height: 40,
                                    objectFit: "cover",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    openPhoto(
                                      log.entryEppPhotoB64,
                                      `Foto EPP — ${
                                        log.user?.name || "Usuario"
                                      } (ID ${log.id})`
                                    )
                                  }
                                  alt="Foto EPP"
                                />
                              </OverlayTrigger>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td
                            className={
                              log.success ? "text-success" : "text-danger"
                            }
                          >
                            {log.success ? "✔" : "✖"}
                          </td>
                          <td>{log.observation || "—"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={logColSpan}
                          className="text-center text-secondary py-4"
                        >
                          No hay registros disponibles.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>

            {/* ===== Vista MOBILE (xs-sm) - Tarjetas ===== */}
            <div className="d-md-none">
              {companyLogs.length === 0 ? (
                <p className="text-center text-secondary py-4">
                  No hay registros disponibles.
                </p>
              ) : (
                <Stack gap={3} className="mt-2">
                  {companyLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-dark text-light rounded p-3 shadow-sm border border-secondary"
                    >
                      {/* Cabecera: usuario + éxito */}
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <div className="fw-bold d-flex align-items-center gap-2">
                            <FaUser />
                            <span>
                              {log.user?.name || "Usuario desconocido"}
                            </span>
                          </div>
                          <small className="text-secondary">
                            <FaMicrochip className="me-1" />
                            {log.device?.name || "Sin dispositivo"}
                          </small>
                        </div>
                        <div className="text-end">
                          <div
                            className={
                              log.success
                                ? "text-success fw-bold"
                                : "text-danger fw-bold"
                            }
                          >
                            {log.success ? (
                              <>
                                <FaCheckCircle className="me-1" />
                                Éxito
                              </>
                            ) : (
                              <>
                                <FaTimesCircle className="me-1" />
                                Fallido
                              </>
                            )}
                          </div>
                          {role === "SA" && (
                            <small className="text-secondary d-block mt-1">
                              <FaBuilding className="me-1" />
                              {log.company?.name || "—"}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Evento */}
                      <div className="mb-2">
                        <small className="d-block">
                          <FaBolt className="me-1" />
                          Evento: {log.eventType?.name || "—"}
                        </small>
                      </div>

                      {/* Fechas */}
                      <div className="mb-2">
                        <small className="d-block">
                          <FaSignInAlt className="me-1 text-success" />
                          Entrada:{" "}
                          {log.entryTime
                            ? getDateAndDayFromTimestamp(log.entryTime)
                            : "—"}
                        </small>
                        <small className="d-block">
                          <FaSignOutAlt className="me-1 text-danger" />
                          Salida:{" "}
                          {log.exitTime
                            ? getDateAndDayFromTimestamp(log.exitTime)
                            : "—"}
                        </small>
                        <small className="d-block">
                          <FaHourglassHalf className="me-1" />
                          Duración:{" "}
                          {log.durationSeconds
                            ? formatSecondsToHHMMSS(log.durationSeconds)
                            : "—"}
                        </small>
                      </div>

                      {/* EPP / Foto */}
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div>
                          <small
                            className={
                              log.correctEpp
                                ? "text-success d-block"
                                : "text-danger d-block"
                            }
                          >
                            <FaHardHat className="me-1" />
                            EPP correcto: {log.correctEpp ? "Sí" : "No"}
                          </small>
                        </div>
                        <div>
                          {log.entryEppPhotoB64 ? (
                            <Image
                              src={toDataUrl(log.entryEppPhotoB64)}
                              roundedCircle
                              style={{
                                width: 48,
                                height: 48,
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                openPhoto(
                                  log.entryEppPhotoB64,
                                  `Foto EPP — ${
                                    log.user?.name || "Usuario"
                                  } (ID ${log.id})`
                                )
                              }
                              alt="Foto EPP"
                            />
                          ) : (
                            <small className="text-secondary">Sin foto</small>
                          )}
                        </div>
                      </div>

                      {/* Observación */}
                      <div className="mb-1">
                        <small className="d-block text-secondary">
                          <FaStickyNote className="me-1" />
                          Observación:
                        </small>
                        <small>
                          {log.observation
                            ? log.observation.length > 120
                              ? log.observation.slice(0, 120) + "..."
                              : log.observation
                            : "—"}
                        </small>
                      </div>
                    </div>
                  ))}
                </Stack>
              )}
            </div>

            {/* Paginación accesos */}
            <div className="d-flex justify-content-between align-items-center text-light mt-3">
              <Button
                variant="outline-light"
                size="sm"
                disabled={logPage === 0}
                onClick={() => setLogPage((p) => p - 1)}
              >
                ← Anterior
              </Button>
              <span>
                Página {logPage + 1} de {totalLogPages}
              </span>
              <Button
                variant="outline-light"
                size="sm"
                disabled={logPage + 1 >= totalLogPages}
                onClick={() => setLogPage((p) => p + 1)}
              >
                Siguiente →
              </Button>
            </div>
          </>
        )}

        {/* (Opcional) Botón de descarga general
        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setShowDownloadModal(true)}
          >
            <FaDownload className="me-2" />
            Descargar registro completo en Excel
          </Button>
        </div>
        */}
      </Container>

      {/* MODAL DESCARGA (dummy) */}
      <Modal
        show={showDownloadModal}
        onHide={() => setShowDownloadModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          className="bg-dark text-light border-secondary"
        >
          <Modal.Title>Seleccionar rango de descarga</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Row className="text-center">
            {["Semanal", "Mensual", "Anual", "Todos"].map((label) => (
              <Col xs={6} className="mb-3" key={label}>
                <Button
                  variant="outline-light"
                  className="w-100 p-3"
                  style={{ borderRadius: "0.5rem" }}
                  onClick={() => handleDownloadClick(label)}
                >
                  {label}
                </Button>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>

      {/* MODAL FOTO EPP */}
      <Modal
        show={!!photoModalB64}
        onHide={closePhoto}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header
          className="bg-dark text-light border-secondary"
          closeButton
        >
          <Modal.Title>{photoModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-center">
          {photoModalB64 && (
            <Image
              src={toDataUrl(photoModalB64)}
              style={{ maxHeight: "70vh", maxWidth: "100%", borderRadius: 10 }}
              alt="Foto EPP"
            />
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button
            variant="outline-light"
            onClick={() =>
              downloadBase64Image(
                photoModalB64,
                `${photoModalTitle.replaceAll(" ", "_").toLowerCase()}.jpg`
              )
            }
          >
            Descargar
          </Button>
          <Button variant="secondary" onClick={closePhoto}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
