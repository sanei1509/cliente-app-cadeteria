import { useNavigate } from "react-router-dom";

const ListarEnvios = () => {
    const navigate = useNavigate();

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th>Código seguimiento</th>
                        <th>Origen / Destino</th>
                        <th>Categoría</th>
                        <th>Tamaño</th>
                        <th>Estado</th>
                        <th>Fecha de retiro</th>
                        <th>Hora aproximada</th>
                        <th>Notas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>TRK-001-2025</td>
                        <td>
                            <div style={{ fontSize: '0.85rem' }}>
                                <div><strong>Origen:</strong> Montevideo</div>
                                <div><strong>Destino:</strong> Canelones</div>
                            </div>
                        </td>
                        <td>Documentos</td>
                        <td>Chico</td>
                        <td><span className="badge badge-warning">Pendiente</span></td>
                        <td>25/10/2025</td>
                        <td>14:00 - 16:00</td>
                        <td>Documentos importantes</td>
                        <td>
                            <button 
                                className="btn btn-sm btn-primary" 
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem', width: '70px' }}
                                onClick={() => navigate("/editar-envio/67123abc45def678")}
                            >
                                Editar
                            </button>
                            <button 
                                className="btn btn-sm btn-danger" 
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}
                                onClick={() => {
                                    if (window.confirm("¿Estás seguro de cancelar este envío?")) {
                                        console.log("Cancelando envío: 67123abc45def678");
                                    }
                                }}
                            >
                                Cancelar
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>TRK-002-2025</td>
                        <td>
                            <div style={{ fontSize: '0.85rem' }}>
                                <div><strong>Origen:</strong> Montevideo</div>
                                <div><strong>Destino:</strong> Punta del Este</div>
                            </div>
                        </td>
                        <td>Electrónicos</td>
                        <td>Mediano</td>
                        <td><span className="badge badge-info" style={{ whiteSpace: 'nowrap' }}>En ruta</span></td>
                        <td>25/10/2025</td>
                        <td>10:00 - 12:00</td>
                        <td>Frágil - manejar con cuidado</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>TRK-003-2025</td>
                        <td>
                            <div style={{ fontSize: '0.85rem' }}>
                                <div><strong>Origen:</strong> Maldonado</div>
                                <div><strong>Destino:</strong> Montevideo</div>
                            </div>
                        </td>
                        <td>Paquetería</td>
                        <td>Grande</td>
                        <td><span className="badge badge-success">Entregado</span></td>
                        <td>24/10/2025</td>
                        <td>09:00 - 11:00</td>
                        <td>-</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>TRK-004-2025</td>
                        <td>
                            <div style={{ fontSize: '0.85rem' }}>
                                <div><strong>Origen:</strong> Colonia</div>
                                <div><strong>Destino:</strong> Montevideo</div>
                            </div>
                        </td>
                        <td>Documentos</td>
                        <td>Chico</td>
                        <td><span className="badge badge-info" style={{ whiteSpace: 'nowrap' }}>En ruta</span></td>
                        <td>25/10/2025</td>
                        <td>15:00 - 17:00</td>
                        <td>Llamar antes de entregar</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>TRK-005-2025</td>
                        <td>
                            <div style={{ fontSize: '0.85rem' }}>
                                <div><strong>Origen:</strong> Montevideo</div>
                                <div><strong>Destino:</strong> Salto</div>
                            </div>
                        </td>
                        <td>Paquetería</td>
                        <td>Mediano</td>
                        <td><span className="badge badge-warning">Pendiente</span></td>
                        <td>26/10/2025</td>
                        <td>13:00 - 15:00</td>
                        <td>Dirección difícil de encontrar</td>
                        <td>
                            <button 
                                className="btn btn-sm btn-primary" 
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem', width: '70px' }}
                                onClick={() => navigate("/editar-envio/67123abc45def682")}
                            >
                                Editar
                            </button>
                            <button 
                                className="btn btn-sm btn-danger" 
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}
                                onClick={() => {
                                    if (window.confirm("¿Estás seguro de cancelar este envío?")) {
                                        console.log("Cancelando envío: 67123abc45def682");
                                    }
                                }}
                            >
                                Cancelar
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>TRK-006-2025</td>
                        <td>
                            <div style={{ fontSize: '0.85rem' }}>
                                <div><strong>Origen:</strong> Paysandú</div>
                                <div><strong>Destino:</strong> Montevideo</div>
                            </div>
                        </td>
                        <td>Documentos</td>
                        <td>Chico</td>
                        <td><span className="badge badge-success">Entregado</span></td>
                        <td>24/10/2025</td>
                        <td>11:00 - 13:00</td>
                        <td>Firmado por portería</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>TRK-007-2025</td>
                        <td>
                            <div style={{ fontSize: '0.85rem' }}>
                                <div><strong>Origen:</strong> Montevideo</div>
                                <div><strong>Destino:</strong> Rivera</div>
                            </div>
                        </td>
                        <td>Electrónicos</td>
                        <td>Grande</td>
                        <td><span className="badge badge-secondary">Cancelado</span></td>
                        <td>25/10/2025</td>
                        <td>16:00 - 18:00</td>
                        <td>Cliente solicitó cancelación</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default ListarEnvios;