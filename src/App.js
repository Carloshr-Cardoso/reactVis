import React, { useState } from 'react'
import {Group} from '@vx/group';
import {Pie, BarGroup} from '@vx/shape';
import {scaleBand, scaleLinear, scaleOrdinal} from '@vx/scale';
import StackedBarChart from './StackedBarChart';

import BrazilMap from './data/BrazilMap.json';
import {
  getPrisionUnitsByUF, 
  getAtributesByUF, 
  getFilterPrisionByUF, 
  getSumOfAtributesByUF
} from './data/DataParse';
import './assets/css/App.css';

const allKeys = ["Homens", "Mulheres"];

const colors = {
  "Homens": "#4EA8DE",
  "Mulheres": "#6930C3"
}

const attrsMas = [
  "regime_fechado_masculino",
  "regime_semiaberto_masculino",
  "regime_aberto_masculino",
  "regime_disciplinar_diferenciado_masculino",
  "internacao_masculino" 
];
const attrsFem = [
  "regime_fechado_feminino",
  "regime_semiaberto_feminino",
  "regime_aberto_feminino",
  "regime_disciplinar_diferenciado_feminino",
  "internacao_feminino" 
];
const width  = window.innerWidth  || document.documentElement.clientWidth || document.body.clientWidth;
const height = window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight;

const unidades_p_estado = getPrisionUnitsByUF();
const prisionUnitsFilter = getFilterPrisionByUF();

const pProvisMas = getAtributesByUF("populacao_presos_provisorios_masculino");
const pProvisFem = getAtributesByUF("populacao_presos_provisorios_feminino");

const pSentenMas = getSumOfAtributesByUF(attrsMas);
const pSentenFem = getSumOfAtributesByUF(attrsFem);


const App = () => {
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

  const data = [
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
        <div className="content">
          <div className="map">
            <svg
              id="svg-map"
              x="0px" 
              y="0px"
              width="450px" 
              height="460px" 
              viewBox="0 0 450 460" 
              enableBackground="new 0 0 450 460"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width={450}
              height={460}
              viewBox="0 0 450 460"
            >
            {BrazilMap.map(({name, uf, d, circlePath, circlePathD, textTransform})=>(
              <a key={uf} className="estado" name={name} uf={uf}>
                <path
                  onClick={()=> setPrisionFilters({...prisionFilters, [uf]:!prisionFilters[uf]})}
                  fill={prisionFilters[uf] ? 'rgba(42,157,143,1)' : 'rgba(38,70,83,1)'}
                  stroke="#FFF"
                  strokeWidth={.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={d}
                  />
                <text fontSize={15} transform={textTransform} fill="#FFF">
                  {uf}
                </text>
                {circlePath ? 
                  <path 
                    onClick={()=> setPrisionFilters({...prisionFilters, [uf]:!prisionFilters[uf]})}
                    strokeWidth={.5}
                    fill={prisionFilters[uf] ? 'rgba(42,157,143,1)' : 'rgba(40,114,113,1)'}
                    className="circle"
                    d={circlePathD}
                  />
                  :
                  null
                }
                
              </a>
            ))}
            </svg>
          </div>

          <svg className="pieChart" width={502} height={502}>
            <Group top={251} left={251}>
              <Pie 
              data={unidades_p_estado}
              pieValue={d => d.unidades}
              innerRadius={250}
              outerRadius={50}
              >
                { pie => {
                    return pie.arcs.map(arc => {
                      const [x, y] = pie.path.centroid(arc);
                      return (
                        <g className="pieSelector" key={arc.data.uf} onClick={()=> setPrisionFilters({...prisionFilters, [arc.data.uf]:!prisionFilters[arc.data.uf]})}>
                          <path fill={prisionFilters[arc.data.uf] ? 'rgba(42,157,143,1)' : 'rgba(38,70,83,1)'} d={pie.path(arc)} />
                          <text textAnchor="middle" fontSize={12} fill="white" x={x*1.35} y={y*1.35}>{arc.data.uf}</text>
                          <text textAnchor="middle" fontSize={12} fill="white" x={x} y={y}>{arc.data.unidades}</text>
                        </g>
                      )
                    } )
                  }
                }
              </Pie>
            </Group>
          </svg>

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

        </div>

        <div className="presos">
          {/* {somaSentenMas > 0 ? <h1>{`Prisioneiros Sentenciados: ${somaSentenMas}`}</h1>: null}
          {somaProvisMas > 0 ? <h1>{`Prisioneiros Provisórios: ${somaProvisMas}`}</h1>: null} */}
            <h2>Stacked Bar Chart D3</h2>,
            <StackedBarChart data={data} keys={allKeys} colors={colors}/>
          {/* {somaProvisMas > 0 ?(
            )
            :
            null
          } */}
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