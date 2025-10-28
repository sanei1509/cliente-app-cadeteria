// src/components/admin/AdminTablaEnvio.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminTablaEnvio({ envio, onEditar, onCancelar }) {//onEditar y onCAncelar por si queremos agregar logica por props
  const navigate = useNavigate();
  const [estado, setEstado] = useState(envio.estadoValue);

  const getEstadoColor = (estadoValue) => {
    const colores = {
      pendiente: 'warning',
      en_ruta: 'info',
      entregado: 'success',
      cancelado: 'secondary',
    };
    return colores[estadoValue] || 'warning';
  };

  const handleEstadoChange = (e) => {
    const nuevo = e.target.value;
    setEstado(nuevo);
    // acá podrías llamar a la API para persistir el cambio si querés
  };

  return (
    <tr>
      <td>{envio.codigoSeguimiento}</td>
      <td>{envio.username}</td>
      <td>{envio.cliente}</td>
      <td>
        <div style={{ fontSize: '0.85rem' }}>
          <div><strong>Origen:</strong> {envio.origen}</div>
          <div><strong>Destino:</strong> {envio.destino}</div>
        </div>
      </td>
      <td>{envio.categoria}</td>
      <td>{envio.tamano}</td>
      <td>
        <select
          className={`badge badge-${getEstadoColor(estado)}`}
          style={{
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            whiteSpace: 'nowrap',
          }}
          value={estado}
          onChange={handleEstadoChange}
        >
          <option value="pendiente">Pendiente</option>
          <option value="en_ruta">En ruta</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </td>
      <td>{envio.fechaRetiro}</td>
      <td>{envio.horaAprox}</td>
      <td>{envio.notas}</td>

      <td>
        {estado === 'pendiente' && (
          <>
            <button
              className="btn btn-sm btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem', width: '70px' }}
              onClick={() => navigate(`/editar-envio/${envio.codigoSeguimiento}`)}
            >
              Editar
            </button>

            <button
              className="btn btn-sm btn-danger"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}
              onClick={() => onCancelar?.(envio)}
            >
              Cancelar
            </button>
          </>
        )}
        
      </td>
    </tr>
  );
}
