// src/components/admin/AdminListaEnvios.jsx
import AdminFiltros from './AdminFiltros';
import AdminTablaEnvio from './AdminTablaEnvio';

const AdminListaEnvios = () => {
  // Datos hardcodeados de ejemplo
  const envios = [
    {
      codigoSeguimiento: 'TRK-001-2025',
      username: 'usuario1',
      cliente: 'Juan Pérez',
      origen: 'Montevideo',
      destino: 'Canelones',
      categoria: 'Documentos',
      tamano: 'Chico',
      estado: 'Pendiente',
      estadoColor: 'warning',
      estadoValue: 'pendiente',
      fechaRetiro: '25/10/2025',
      horaAprox: '14:00 - 16:00',
      notas: 'Documentos importantes'
    },
    {
      codigoSeguimiento: 'TRK-002-2025',
      username: 'maria_g',
      cliente: 'María González',
      origen: 'Montevideo',
      destino: 'Punta del Este',
      categoria: 'Electrónicos',
      tamano: 'Mediano',
      estado: 'En ruta',
      estadoColor: 'info',
      estadoValue: 'en_ruta',
      fechaRetiro: '25/10/2025',
      horaAprox: '10:00 - 12:00',
      notas: 'Frágil - manejar con cuidado'
    },
    {
      codigoSeguimiento: 'TRK-003-2025',
      username: 'carlos_r',
      cliente: 'Carlos Rodríguez',
      origen: 'Maldonado',
      destino: 'Montevideo',
      categoria: 'Paquetería',
      tamano: 'Grande',
      estado: 'Entregado',
      estadoColor: 'success',
      estadoValue: 'entregado',
      fechaRetiro: '24/10/2025',
      horaAprox: '09:00 - 11:00',
      notas: '-'
    },
    {
      codigoSeguimiento: 'TRK-004-2025',
      username: 'ana_m',
      cliente: 'Ana Martínez',
      origen: 'Colonia',
      destino: 'Montevideo',
      categoria: 'Documentos',
      tamano: 'Chico',
      estado: 'En ruta',
      estadoColor: 'info',
      estadoValue: 'en_ruta',
      fechaRetiro: '25/10/2025',
      horaAprox: '15:00 - 17:00',
      notas: 'Llamar antes de entregar'
    },
    {
      codigoSeguimiento: 'TRK-005-2025',
      username: 'roberto_s',
      cliente: 'Roberto Silva',
      origen: 'Montevideo',
      destino: 'Salto',
      categoria: 'Paquetería',
      tamano: 'Mediano',
      estado: 'Pendiente',
      estadoColor: 'warning',
      estadoValue: 'pendiente',
      fechaRetiro: '26/10/2025',
      horaAprox: '13:00 - 15:00',
      notas: 'Dirección difícil de encontrar'
    },
    {
      codigoSeguimiento: 'TRK-006-2025',
      username: 'laura_f',
      cliente: 'Laura Fernández',
      origen: 'Paysandú',
      destino: 'Montevideo',
      categoria: 'Documentos',
      tamano: 'Chico',
      estado: 'Entregado',
      estadoColor: 'success',
      estadoValue: 'entregado',
      fechaRetiro: '24/10/2025',
      horaAprox: '11:00 - 13:00',
      notas: 'Firmado por portería'
    },
    {
      codigoSeguimiento: 'TRK-007-2025',
      username: 'diego_m',
      cliente: 'Diego Martín',
      origen: 'Montevideo',
      destino: 'Rivera',
      categoria: 'Electrónicos',
      tamano: 'Grande',
      estado: 'Cancelado',
      estadoColor: 'secondary',
      estadoValue: 'cancelado',
      fechaRetiro: '25/10/2025',
      horaAprox: '16:00 - 18:00',
      notas: 'Cliente solicitó cancelación'
    }
  ];

  return (
    <section className="table-container">
      <div className="card-header flex-between">
        <div>
          <h3 className="card-title">Todos los envíos</h3>
        </div>
      </div>

      <AdminFiltros />

      <table className="table">
        <thead>
          <tr>
            <th>Código seguimiento</th>
            <th>Usuario</th>
            <th>Cliente</th>
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
          {envios.map((envio) => (
            <AdminTablaEnvio key={envio.codigoSeguimiento} envio={envio} />
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default AdminListaEnvios;