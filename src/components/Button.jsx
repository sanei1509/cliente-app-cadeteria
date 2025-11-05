/**
 * Componente Button dinámico y reutilizable
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>Click me</Button>
 * <Button variant="danger" fullWidth disabled>Disabled</Button>
 * <Button variant="ghost" icon={<SaveIcon />}>Guardar</Button>
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  children,
  icon,
  iconPosition = 'left',
  className = '',
  style = {}
}) => {
  // Construir clases CSS
  const classes = ['btn'];

  // Variantes: primary, secondary, outline, ghost, danger, upgrade
  if (variant !== 'primary') classes.push(`btn-${variant}`);
  else classes.push('btn-primary');

  // Tamaños: sm, md (default)
  if (size === 'sm') classes.push('btn-sm');

  // Full width
  if (fullWidth) classes.push('btn-full');

  // Clases adicionales
  if (className) classes.push(className);

  return (
    <button
      type={type}
      className={classes.join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
    >
      {loading && <span>Cargando...</span>}
      {!loading && icon && iconPosition === 'left' && icon}
      {!loading && children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};

export default Button;
