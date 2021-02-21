import data from '../data/csvjson.json';

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

//Atributes = Array de Strings
const getSumOfAtributesByUF = (atributes) => {
  const attrArr = [];
  atributes.map((atribute)=>{
    const someAtribute = data.reduce((pv, cv) => {
      if ( pv[cv.uf] ) {
        if (cv[atribute] != '')
          pv[cv.uf] += cv[atribute];
      } else {
          pv[cv.uf] = cv[atribute];
      }
      return pv;
    }, {});

    attrArr.push(someAtribute)

  })
  // console.log(attrArr);
  const sumAttr = {};
  Object.keys(attrArr[0]).map(uf => sumAttr[uf] = 0);  
  attrArr.map((arr)=>{
    Object.keys(arr).map((key)=>{
      if (!arr[key] == "")
        sumAttr[key] += arr[key];
    });
  });
  // console.log(sumAttr);
  const SumOfAtributesByUF = Object.entries(sumAttr).map(([k, v]) => ({
    label: k,
    value: v
  }));
  
  return SumOfAtributesByUF;
}

const getSomeAtributesByUF = (atributes) =>{
  const atributesArr = [];
  atributes.map((atribute, index)=>{
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

    atributesArr.push(someAtributeByStates)
  });

  const someAtributeByStates = Object.entries(atributesArr)
  // console.log("DataParse");
  // console.log(someAtributeByStates);

  return atributesArr;
}


export {getPrisionUnitsByUF, getAtributesByUF, getFilterPrisionByUF, getSumOfAtributesByUF, getSomeAtributesByUF};