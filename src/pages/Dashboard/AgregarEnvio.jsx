
import { useNavigate } from "react-router-dom";


const AgregarEnvio = () => {
     const navigate = useNavigate();
    return (
        <>
        <div>
              <h3 className="card-title">Envíos</h3>
            </div>

            <button
              className="btn btn-primary"
              style={{ minWidth: '250px' }}
              onClick={() => navigate("/envios/nuevo")}
            >
              Registrar envío
            </button>
        </>
        
    )
}

export default AgregarEnvio;