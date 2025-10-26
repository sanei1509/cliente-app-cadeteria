
import AgregarEnvio from './AgregarEnvio';
import ListarEnvios from './ListarEnvios';
import Filtros from './Filtros';

const Envios = () => {
    return (
        <>
        
          <div className="card-header flex-between">
            < AgregarEnvio />
            </div>

             <div className="filtros">
            < Filtros />

          </div>

          <div className="table envios">
            < ListarEnvios />

          </div>
        </>
    )
}

export default Envios;