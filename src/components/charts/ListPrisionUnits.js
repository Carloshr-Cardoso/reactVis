import React from 'react';

const ListPrisionUnits = ({unidades, somaUnidades}) => {
  return (
    <div className="total-sum">
      <h1>Unidades Prisionais</h1>
      <div className="uf-units">
          {unidades.map(({uf, unidades}) =>{
            return(
                <div className="prision-filter">
                  <h3>{unidades}</h3>
                  <h4>Unidades Prisionais em</h4>
                  <h3>{uf}</h3>
                </div>
              )
            }
          )}
      </div>
      <hr/>
      <div className="prision-filter">
        <h3>{somaUnidades}</h3>
        <h4>Unidades Prisionais Selecionadas</h4>
      </div>
    </div>
  );
};

export default ListPrisionUnits;