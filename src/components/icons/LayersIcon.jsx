const LayersIcon = ({ width = 24, height = 24, fill = "currentColor", className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill={fill}
    className={className}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

export default LayersIcon;
