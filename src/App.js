import './assets/css/App.css';
import React, { useState } from 'react'

import StackedBarChart from './components/charts/StackedBarChart';
import PieChart from './components/charts/PieChart';
import BrazilMap from './components/map/BrazilMap';

import {
  getPrisionUnitsByUF, 
  getAtributesByUF, 
  getFilterPrisionByUF, 
  getSumOfAtributesByUF
} from './helpers/DataParse';
import {
  fieldProvisoriosM,
  fieldProvisoriosF,
  fieldsSentenciadosM, 
  fieldsSentenciadosF,
  allKeys,
  colors
} from './helpers/auxVariables'
import ListPrisionUnits from './components/charts/ListPrisionUnits';


const unidades_p_estado = getPrisionUnitsByUF();
const prisionUnitsFilter = getFilterPrisionByUF();

const pProvisMas = getAtributesByUF(fieldProvisoriosM);
const pProvisFem = getAtributesByUF(fieldProvisoriosF);

const pSentenMas = getSumOfAtributesByUF(fieldsSentenciadosM);
const pSentenFem = getSumOfAtributesByUF(fieldsSentenciadosF);


const App = () => {
  const [selectAllButtom, setSelectAllButtom] = useState(false);

  const [prisionFilters, setPrisionFilters] = useState(prisionUnitsFilter);
  const unidades = unidades_p_estado.filter(({uf}) => prisionFilters[uf]);

  let somaUnidades = 0;
  unidades.map(({uf, unidades})=>(
    prisionFilters[uf] ? somaUnidades += unidades: null
  ));

  let somaProvisMas = 0;
  pProvisMas.map(({label, value})=>(
    prisionFilters[label] ? somaProvisMas += value: null
  ));

  let somaProvisFem = 0;
  pProvisFem.map(({label, value})=>(
    prisionFilters[label] ? somaProvisFem += value: null
  ));

  let somaSentenMas = 0;
  pSentenMas.map(({label, value})=>(
    prisionFilters[label] ? somaSentenMas += value: null
  ));

  let somaSentenFem = 0;
  pSentenFem.map(({label, value})=>(
    prisionFilters[label] ? somaSentenFem += value: null
  ));

  const StackedBarData = [
    {
      label: "Provisorios",
      Homens: somaProvisMas,
      Mulheres: somaProvisFem 
    },
    {
      label: "Sentenciados",
      Homens: somaSentenMas,
      Mulheres: somaSentenFem 
    },
  ];

  // if (selectAllButtom){
  //   const filterKeys = Object.keys(prisionFilters);
  //   filterKeys.map((key)=>{
  //     const newObj = {... prisionFilters};
  //     newObj[key] = true;
  //     setPrisionFilters(newObj);
  //   })
  // }
  // else{
  //   console.log("Deselecionando Tudo")
  // }


  return (
    <React.Fragment>
      <div className="navbar"></div>
      <div className="container">
      <h1 className="title">Trabalho Escroto da Porra</h1>
        <div className="content">
          <BrazilMap prisionFilters={prisionFilters} setPrisionFilters={setPrisionFilters}/>
          <PieChart data={unidades_p_estado} prisionFilters={prisionFilters} setPrisionFilters={setPrisionFilters}/>
          <ListPrisionUnits unidades={unidades} somaUnidades={somaUnidades} />
        </div>
          <StackedBarChart data={StackedBarData} keys={allKeys} colors={colors}/>
        {/* <div className="presos">
          <h2>Stacked Bar Chart D3</h2>
        </div> */}
      </div>

    </React.Fragment>
  );
}

export default App;


// TODO List
// *Achar um jeito de Concatenar todos os Arrays de Dados considerando os estados Selecionados.
// *Fazer Filtro de Sexo para Grafico de Barra Empilhada
// Adicionar Legenda Hover ao Grafico de Barra
// *Criar Gráfico de Pena Sentenciada Para os Presos Sentenciados.
// *Criar Gráfico de Gauge (Gauge Chart) Sobre os Presos provisórios que estão presos a mais de 90 dias.