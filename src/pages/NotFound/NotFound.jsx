import { useNavigate } from "react-router-dom";
import { TruckIcon } from "../../components/icons";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* Icono del camión perdido */}
        <div className="not-found-truck">
          <TruckIcon width={120} height={120} />
          <div className="not-found-clouds">
            <div className="cloud cloud-1">💨</div>
            <div className="cloud cloud-2">💨</div>
            <div className="cloud cloud-3">💨</div>
          </div>
        </div>

        <div className="not-found-code">404</div>

        <h1 className="not-found-title">¡Ups! Envío extraviado</h1>
        <p className="not-found-message">
          Parece que el paquete que buscás se perdió en el camino...
        </p>
        <p className="not-found-submessage">
          Esta página no existe o fue movida a otra dirección 📦
        </p>

        <div className="not-found-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/dashboard")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ marginRight: "0.5rem" }}
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Volver al Dashboard
          </button>

          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← Volver atrás
          </button>
        </div>

        <div className="not-found-footer">
          <p>Si seguís perdido, revisá la dirección URL</p>
        </div>
      </div>

      <style>{`
        .not-found-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: var(--spacing-md);
        }

        .not-found-content {
          max-width: 600px;
          text-align: center;
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .not-found-truck {
          position: relative;
          margin-bottom: var(--spacing-lg);
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .not-found-truck svg {
          color: var(--primary-color);
          filter: drop-shadow(0 10px 20px rgba(255, 107, 53, 0.2));
        }

        .not-found-clouds {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .cloud {
          position: absolute;
          font-size: 2rem;
          opacity: 0.6;
          animation: float 3s ease-in-out infinite;
        }

        .cloud-1 {
          top: 20%;
          left: -10%;
          animation-delay: 0s;
        }

        .cloud-2 {
          top: 50%;
          right: -10%;
          animation-delay: 1s;
        }

        .cloud-3 {
          bottom: 20%;
          left: 10%;
          animation-delay: 2s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, -10px);
          }
        }

        .not-found-code {
          font-size: 8rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: var(--spacing-md);
          text-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
        }

        .not-found-title {
          font-size: var(--font-size-2xl);
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
        }

        .not-found-message {
          font-size: var(--font-size-lg);
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xs);
        }

        .not-found-submessage {
          font-size: var(--font-size-base);
          color: var(--text-light);
          margin-bottom: var(--spacing-lg);
        }

        .not-found-actions {
          display: flex;
          gap: var(--spacing-sm);
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: var(--spacing-xl);
        }

        .not-found-footer {
          padding: var(--spacing-md);
          background: var(--surface);
          border-radius: var(--radius-md);
          border: 2px dashed var(--border-color);
          margin-top: var(--spacing-lg);
        }

        .not-found-footer p {
          margin: 0.25rem 0;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .not-found-footer strong {
          color: var(--text-primary);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .not-found-code {
            font-size: 5rem;
          }

          .not-found-title {
            font-size: var(--font-size-xl);
          }

          .not-found-truck svg {
            width: 80px;
            height: 80px;
          }

          .not-found-actions {
            flex-direction: column;
          }

          .not-found-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
