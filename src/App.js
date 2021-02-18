// Import React & CSS
import './assets/css/App.css';
import React, { useState } from 'react'

// Import Components
import StackedBarChart from './components/charts/StackedBarChart';
import PieChart from './components/charts/PieChart';
import BrazilMap from './components/map/BrazilMap';
import ListPrisionUnits from './components/charts/ListPrisionUnits';
import GaugeChart from './components/charts/GaugeChart';
import Navbar from './components/navbar'

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
  fieldProvisorios90DiasM,
  fieldProvisorios90DiasF,
  allKeys,
  colors
} from './helpers/auxVariables'


const unidades_p_estado = getPrisionUnitsByUF();
const prisionUnitsFilter = getFilterPrisionByUF();

const pProvisMas = getAtributesByUF(fieldProvisoriosM);
const pProvisFem = getAtributesByUF(fieldProvisoriosF);

const provisMais90M = getAtributesByUF(fieldProvisorios90DiasM);
const provisMais90F = getAtributesByUF(fieldProvisorios90DiasF);

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

  let somaProvisMais90M = 0;
  provisMais90M.map(({label, value})=>(
    prisionFilters[label] ? somaProvisMais90M += value: null
  ));

  let somaProvisMais90F = 0;
  provisMais90F.map(({label, value})=>(
    prisionFilters[label] ? somaProvisMais90F += value: null
  ));
  

  let provisPercent = ((somaProvisMais90M + somaProvisMais90F)/(somaProvisMas + somaProvisFem)).toFixed(3);
  let sentenPercent = (1 - provisPercent).toFixed(3);
  
  const gaugeData = [provisPercent, sentenPercent];
  const baseGauge = [0.5, 0.5]

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

  return (
    <React.Fragment>
      <div className="navbar"></div>
        <div className="container">
        <h1 className="title">Trabalho Escroto da Porra</h1>

          <div className="flex-container">
            <div className="flex-child">
            <BrazilMap prisionFilters={prisionFilters} setPrisionFilters={setPrisionFilters}/>
            </div>
            <div className="flex-child">
            <PieChart data={unidades_p_estado} prisionFilters={prisionFilters} setPrisionFilters={setPrisionFilters}/>
            </div>
            <div className="flex-child">
            <ListPrisionUnits unidades={unidades} somaUnidades={somaUnidades} />
            </div>
          </div>


          <div className="flex-container">
            <div className="flex-child">
              <StackedBarChart data={StackedBarData} keys={allKeys} colors={colors}/>
            </div>
            <div id="gaugeChart" className="flex-child">
              {somaUnidades ? <GaugeChart data={gaugeData} base={false}/> : <GaugeChart data={baseGauge} base={true}/>}
            </div>
          </div>

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