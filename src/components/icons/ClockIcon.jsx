const ClockIcon = ({ width = 20, height = 20, fill = "currentColor", className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path
      d="M12 6v6l4 2"
      stroke="white"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ClockIcon;
