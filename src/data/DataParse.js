import data from './csvjson.json';

const getPrisionUnitsByUF = () =>{
  const countUnits = data.reduce((acc, {uf}) =>({
    ...acc,
    [uf] : ++acc[uf] || 1
  }), {})

  const countUnitsByUF = Object.entries(countUnits).map(([k, v]) => ({
    uf: k,
    unidades: v
  }));

  return countUnitsByUF
  
}

const getFilterPrisionByUF = () =>{
  const initialFilter = data.reduce((acc, {uf}) =>({
    ...acc,
    [uf] : false
  }), {})

  return initialFilter;
}

const getAtributesByUF = (atribute) =>{
  const someAtribute = data.reduce((pv, cv) => {
    if ( pv[cv.uf] ) {
      if (cv[atribute] != '')
        pv[cv.uf] += cv[atribute];
    } else {
        pv[cv.uf] = cv[atribute];
    }
    return pv;
  }, {});

  const someAtributeByStates = Object.entries(someAtribute).map(([k, v]) => ({
    label: k,
    value: v
  }));

  return someAtributeByStates
}

export {getPrisionUnitsByUF, getAtributesByUF, getFilterPrisionByUF};