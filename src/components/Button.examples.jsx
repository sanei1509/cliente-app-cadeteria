import Button from './Button';

/**
 * Ejemplos de uso del componente Button
 * Archivo de referencia - NO importar en la app
 */

// ========================================
// EJEMPLOS BÁSICOS
// ========================================

// Botón Primary (default)
<Button onClick={() => console.log('clicked')}>
  Click me
</Button>

// Botón Secondary
<Button variant="secondary">
  Secundario
</Button>

// Botón Outline
<Button variant="outline">
  Outline
</Button>

// Botón Ghost
<Button variant="ghost">
  Ghost
</Button>

// Botón Danger
<Button variant="danger">
  Eliminar
</Button>

// Botón Upgrade (naranja/dorado)
<Button variant="upgrade">
  Actualizar Plan
</Button>

// ========================================
// TAMAÑOS
// ========================================

// Botón pequeño
<Button size="sm">
  Pequeño
</Button>

// Botón mediano (default)
<Button>
  Mediano
</Button>

// ========================================
// ESTADOS
// ========================================

// Botón deshabilitado
<Button disabled>
  Deshabilitado
</Button>

// Botón en carga
<Button loading>
  Guardando...
</Button>

// ========================================
// FULL WIDTH
// ========================================

// Botón que ocupa todo el ancho
<Button fullWidth>
  Ancho completo
</Button>

<Button variant="primary" fullWidth>
  Iniciar Sesión
</Button>

// ========================================
// CON ÍCONOS
// ========================================

// Ícono a la izquierda (default)
<Button icon={
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
}>
  Nuevo Envío
</Button>

// Ícono a la derecha
<Button
  icon={<span>→</span>}
  iconPosition="right"
>
  Siguiente
</Button>

// Solo ícono (sin texto)
<Button icon={
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
} />

// ========================================
// TIPOS DE SUBMIT
// ========================================

// Botón de submit en formulario
<form onSubmit={handleSubmit}>
  <Button type="submit" variant="primary" fullWidth>
    Crear Cuenta
  </Button>
</form>

// Botón de reset
<Button type="reset" variant="ghost">
  Limpiar
</Button>

// ========================================
// CASOS DE USO REALES
// ========================================

// Formulario de Login
<Button type="submit" variant="primary" fullWidth disabled={!isValid}>
  Iniciar Sesión
</Button>

// Modal con acciones
<div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
  <Button variant="ghost" fullWidth onClick={onClose}>
    Cancelar
  </Button>
  <Button variant="primary" fullWidth type="submit">
    Confirmar
  </Button>
</div>

// Tabla con acciones
<Button size="sm" variant="primary" onClick={() => handleEdit(id)}>
  Editar
</Button>
<Button size="sm" variant="danger" onClick={() => handleDelete(id)}>
  Cancelar
</Button>

// Navbar
<Button
  variant="upgrade"
  onClick={() => setShowUpgradeModal(true)}
>
  Upgrade a Premium
</Button>

// ========================================
// CON CLASES PERSONALIZADAS
// ========================================

// Agregar estilos adicionales
<Button className="my-custom-class" style={{ marginTop: '1rem' }}>
  Custom Button
</Button>

// ========================================
// CASOS COMPLEJOS
// ========================================

// Botón con estado de carga dinámico
const [isSubmitting, setIsSubmitting] = useState(false);

<Button
  type="submit"
  variant="primary"
  fullWidth
  loading={isSubmitting}
  disabled={!isValid || isSubmitting}
>
  {isSubmitting ? 'Procesando...' : 'Registrar Envío'}
</Button>

export default null; // No exportar nada, solo ejemplos
