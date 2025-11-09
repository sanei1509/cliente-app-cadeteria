const Button = ({
  value,              
  loadingContent,       
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  children,              // fallback para compatibilidad
  icon,
  iconPosition = 'left',
  className = '',
  style = {},
}) => {
  const classes = ['btn'];
  if (variant !== 'primary') classes.push(`btn-${variant}`); else classes.push('btn-primary');
  if (size === 'sm') classes.push('btn-sm');
  if (fullWidth) classes.push('btn-full');
  if (className) classes.push(className);

  const label = value ?? children; // si no pasás value, usa children

  return (
    <button
      type={type}
      className={classes.join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
    >
      {loading ? (
        // Si hay loadingContent lo uso; si no, muestro label
        loadingContent ?? label
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {label}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
};

export default Button;