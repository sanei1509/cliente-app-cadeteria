const ComprobanteModal = ({ isOpen, onClose, imageUrl, title = "Comprobante de pago" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "800px", width: "90%" }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="modal-body" style={{ padding: "1rem" }}>
          {imageUrl ? (
            <div style={{ textAlign: "center" }}>
              <img
                src={imageUrl}
                alt="Comprobante de pago"
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  borderRadius: "8px",
                  objectFit: "contain",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              <p>No hay comprobante disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprobanteModal;
