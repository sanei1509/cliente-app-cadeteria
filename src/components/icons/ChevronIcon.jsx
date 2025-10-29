const ChevronIcon = ({ width = 20, height = 20, fill = "currentColor", className = "", style = {} }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
    style={style}
  >
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

export default ChevronIcon;
