import { Spinner } from "./Spinner";

const KPICard = ({
  label,
  icon,
  iconColor = "primary", // primary, info, success, warning
  value,
  isLoading,
  subtitle,
  subtitleLoading = false, // Si el subtitle también debe mostrar loading
  children, // Para contenido adicional como el badge premium
}) => {
  return (
    <article className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className={`stat-icon stat-icon-${iconColor}`}>{icon}</div>
      </div>

      <div className="stat-value">
        {isLoading ? (
          <Spinner color={"text-primary"} size={"spinner-border-md"} />
        ) : (
          value
        )}
      </div>

      {subtitle && (
        <div className="stat-change">
          {subtitleLoading ? (
            <Spinner color={"text-primary"} size={"spinner-border-sm"} />
          ) : (
            subtitle
          )}
        </div>
      )}

      {children}
    </article>
  );
};

export default KPICard;
