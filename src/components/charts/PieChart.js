import React from 'react';
import {Group} from '@vx/group';
import {Pie} from '@vx/shape';


const PieChart = ({ data, prisionFilters, setPrisionFilters }) => {
  return (
    <svg className="pieChart" width={502} height={502}>
    <Group top={251} left={251}>
      <Pie 
      data={data}
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
  );
};

export default PieChart;