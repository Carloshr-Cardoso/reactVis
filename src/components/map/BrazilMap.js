import React from 'react';
import map from '../../data/BrazilMap.json';

const BrazilMap = ({prisionFilters, setPrisionFilters}) => {
  return(
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
        {map.map(({name, uf, d, circlePath, circlePathD, textTransform})=>(
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
  );
};

export default BrazilMap;