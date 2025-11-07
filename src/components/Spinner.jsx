export const Spinner = ({ color, size }) => {
  return (
    <div
      className={`spinner-border ${color ? color : "text-light"} ${
        size ? size : "spinner-border-sm"
      }`}
    ></div>
  );
};
