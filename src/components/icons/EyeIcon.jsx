const EyeIcon = ({ isOpen = false }) => {
  if (isOpen) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58A3 3 0 0 0 13.42 13.4" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.4 19.4 0 0 1-4.15 5.35" />
      <path d="M6.1 6.1A19.4 19.4 0 0 0 1 12s4 8 11 8c1.13 0 2.21-.18 3.23-.5" />
    </svg>
  );
};

export default EyeIcon;
