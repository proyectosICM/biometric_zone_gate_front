import { Container, Form, Table, Button } from "react-bootstrap";
import { useState } from "react";
import { CustomNavbar } from "../components/CustomNavbar";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";

export function Observations() {
    const initialZones = [
        {
            id: 1,
            name: "Zona A - Laboratorio",
            recentCount: 3,
            accesses: [
                { id: 101, user: "Carlos R.", time: "10:25 AM", observation: "Todo correcto", reviewed: false },
                { id: 102, user: "Lucía V.", time: "10:10 AM", observation: "Ingreso retrasado", reviewed: false },
                { id: 103, user: "Marcos T.", time: "9:45 AM", observation: "Acceso autorizado sin novedad", reviewed: true },
                { id: 104, user: "Carlos R.", time: "10:25 AM", observation: "Todo correcto", reviewed: false },
                { id: 105, user: "Lucía V.", time: "10:10 AM", observation: "Ingreso retrasado", reviewed: false },
                { id: 106, user: "Marcos T.", time: "9:45 AM", observation: "Acceso autorizado sin novedad", reviewed: true },
                { id: 107, user: "Carlos R.", time: "10:25 AM", observation: "Todo correcto", reviewed: false },
                { id: 108, user: "Lucía V.", time: "10:10 AM", observation: "Ingreso retrasado", reviewed: false },
                { id: 109, user: "Marcos T.", time: "9:45 AM", observation: "Acceso autorizado sin novedad", reviewed: true },
            ],
        },
        {
            id: 2,
            name: "Zona B - Almacén",
            recentCount: 2,
            accesses: [
                { id: 201, user: "Johana M.", time: "10:00 AM", observation: "Todo en orden", reviewed: false },
                { id: 202, user: "Luis C.", time: "9:50 AM", observation: "Intento fallido, autorizado después", reviewed: true },
            ],
        },
        {
            id: 3,
            name: "Zona C - Producción",
            recentCount: 4,
            accesses: [
                { id: 301, user: "Pedro A.", time: "10:30 AM", observation: "Ingreso puntual", reviewed: false },
                { id: 302, user: "Ana P.", time: "10:25 AM", observation: "Acceso autorizado", reviewed: false },
                { id: 303, user: "Erick J.", time: "10:20 AM", observation: "Todo correcto", reviewed: false },
                { id: 304, user: "Sandra G.", time: "10:15 AM", observation: "Revisión pendiente", reviewed: true },
            ],
        },
        {
            id: 4,
            name: "Zona D - Administración",
            recentCount: 1,
            accesses: [
                { id: 401, user: "Martina R.", time: "9:30 AM", observation: "Acceso normal", reviewed: false },
            ],
        },
    ];

    // Estado principal
    const [zones, setZones] = useState(initialZones);
    const [selectedZone, setSelectedZone] = useState("all");

    // Paginación
    const [page, setPage] = useState(0);
    const itemsPerPage = 5;

    // Marcar como revisado
    const handleReview = (zoneId, accessId) => {
        setZones(prevZones =>
            prevZones.map(zone =>
                zone.id === zoneId
                    ? {
                        ...zone,
                        accesses: zone.accesses.map(acc =>
                            acc.id === accessId ? { ...acc, reviewed: true } : acc
                        ),
                    }
                    : zone
            )
        );
    };

    // Filtrar según selección
    const filteredZones =
        selectedZone === "all"
            ? zones
            : zones.filter((z) => z.id === Number(selectedZone));

    // Unificar todos los accesos en una sola lista para la paginación
    const allAccesses = filteredZones.flatMap(zone =>
        zone.accesses.map(acc => ({ ...acc, zoneName: zone.name, zoneId: zone.id }))
    );

    // Calcular índices de paginación
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAccesses = allAccesses.slice(startIndex, endIndex);

    const totalPages = Math.ceil(allAccesses.length / itemsPerPage);
    const isLast = page >= totalPages - 1;

    const handlePrevious = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNext = () => {
        if (!isLast) setPage(page + 1);
    };

    return (
        <div className="g-background">
            <CustomNavbar />
            <Container className="mt-4">
                <h2 className="text-white text-center mb-4">Observaciones</h2>

                <Form.Group className="mb-4">
                    <Form.Label className="text-light">Ver observaciones por zona:</Form.Label>
                    <Form.Select
                        className="bg-secondary text-light border-0"
                        value={selectedZone}
                        onChange={(e) => {
                            setSelectedZone(e.target.value);
                            setPage(0); // Reiniciar a la primera página cuando cambie la zona
                        }}
                    >
                        <option value="all">Todas</option>
                        {zones.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                                {zone.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <div className="table-responsive">
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Zona</th>
                                <th>Usuario</th>
                                <th>Hora</th>
                                <th>Observación</th>
                                <th>Revisado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedAccesses.map((acc) => (
                                <tr key={acc.id}>
                                    <td>{acc.zoneName}</td>
                                    <td>{acc.user}</td>
                                    <td>{acc.time}</td>
                                    <td>{acc.observation}</td>
                                    <td className="text-center">
                                        {acc.reviewed ? (
                                            <BsCheckCircleFill color="limegreen" size={20} />
                                        ) : (
                                            <BsXCircleFill color="crimson" size={20} />
                                        )}
                                    </td>
                                    <td>
                                        {!acc.reviewed && (
                                            <Button
                                                variant="light"
                                                size="sm"
                                                onClick={() => handleReview(acc.zoneId, acc.id)}
                                            >
                                                Marcar como revisado
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                {/* Controles de paginación */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-between mt-3">
                        <Button variant="outline-light" onClick={handlePrevious} disabled={page === 0}>
                            ← Anterior
                        </Button>
                        <span className="text-light align-self-center">
                            Página {page + 1} de {totalPages}
                        </span>
                        <Button variant="outline-light" onClick={handleNext} disabled={isLast}>
                            Siguiente →
                        </Button>
                    </div>
                )}
            </Container>
        </div>
    );
}
