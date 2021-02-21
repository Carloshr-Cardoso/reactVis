import React from 'react';

const ListPrisionUnits = ({unidades, somaUnidades}) => {
  return (
    <div className="total-sum">
      <h1>Unidades Prisionais</h1>
        <div className="uf-units">
          {unidades.map(({uf, unidades}) =>{
            return(
                  <h3>{`${unidades} Unidades Prisionais em ${uf}`}</h3>
              )
            }
          )}
        </div>
      <h3>{`${somaUnidades} Unidades Prisionais Selecionadas`}</h3>
    </div>
  );
};

export default ListPrisionUnits;