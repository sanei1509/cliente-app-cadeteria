import AgregarEnvio from './AgregarEnvio';
import ListarEnvios from './ListarEnvios';
import Filtros from './Filtros';

const Envios = () => {
    return (
        <>
          <div className="card-header flex-between">
            <AgregarEnvio />
          </div>

          {/* <Filtros /> */}

          <div className="table-container table-container-no-shadow">
            <ListarEnvios />
          </div>
        </>
    );
};

export default Envios;