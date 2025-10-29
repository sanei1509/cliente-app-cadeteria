const StarIcon = ({ width = 24, height = 24, fill = "currentColor", className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill={fill}
    className={className}
  >
    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
  </svg>
);

export default StarIcon;
