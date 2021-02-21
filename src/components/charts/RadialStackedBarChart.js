import React, {useEffect, useRef} from 'react';
import useResizeObserver from '../../hooks/useResizeObserver';
import { select, scaleBand, axisBottom, scaleRadial, max, arc, scaleOrdinal, stack, stackOrderAscending, dragDisable, sum } from 'd3';

const width = 975;
const height = width;
const innerRadius = 180;
const outerRadius = Math.min(width, height)/2;

const RadialStackedBarChart = ({data, keys}) => {
  // console.log(keys);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  // const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect();


  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const textOrange = "#F4A261";
    // const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect();
    
    //Scales
    const arcScale = arc()
      .innerRadius(d => y(d[0]))
      .outerRadius(d => y(d[1]))
      .startAngle(d => x(d.data.uf))
      .endAngle(d => x(d.data.uf) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius);
    
    const x = scaleBand()
      .domain(data.map(d => d.uf))
      .range([0, 2*Math.PI])
      .align(0);

    const y = scaleRadial()
      .domain([0, 250000])
      .range([innerRadius, outerRadius]);
  
    const z = scaleOrdinal()
      .domain(keys)
      .range(["#F94144", "#F3722C", "#F8961E", "#F9844A", "#F9C74F", "#90BE6D", "#43AA8B", "#4D908E", "none"]);

    // Axis

    const xAxis = g => g
      .attr("text-anchor", "middle")
      .call(g => g.selectAll("g")
        .data(data)
        .join("g")
          .attr("transform", d => `
          rotate(${((x(d.uf) + x.bandwidth() / 2) * 180 / Math.PI -90)})
          translate(${innerRadius}, 0)
          `)
          .call(g => g.append("line")
            .attr("x2", -5)
            .attr("stroke", textOrange))
          .call(g => g.append("text")
            .attr("transform", d => (x(d.uf) + x.bandwidth() / 2 + Math.PI/2) % (2*Math.PI) < Math.pi
              ? "rotate(90)translate(0,16)"
              : "rotate(-90)translate(0,-9)")
            .text(d => d.uf)
              .style("font-size", "20px")
              .style("fill", textOrange)));

    const yAxis = g => g
      .attr("text-anchor", "middle")
      .call(g => g.append("text")
        .style("fill", textOrange)
        .attr("y", d=> -y(y.ticks(7).pop()))
        .attr("dy", "-1em")
        .text("População Prisional")
          .style("font-size", "20px")
          .style("fill", textOrange)
          )
      .call(g => g.selectAll("g")
        .data(y.ticks(7).slice(1))
        .join("g")
          .attr("fill", "none")
          .call(g => g.append("circle")
            .attr("stroke", textOrange)
            .attr("stroke-opacity", 0.5)
            .attr("r", y))
          .call(g => g.append("text")
            .attr("y", d => -y(d))
            .attr("dy", "0.35em")
            .text(y.tickFormat(7, "s"))
              .style("font-size", "20px")
              .style("fill", textOrange)
          .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")))

    const legend = g => g.append("g")
      .selectAll("g")
      .data(keys)
      .join("g")
        .attr("transform", (d, i) => `translate(-70, ${(i - (keys.length) / 2) * 20})`)
        .call(g => g.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", z))
        .call(g => g.append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .text(d => d)
            .style("font-size", "20px")
            .style("fill", textOrange))
    
  svg.append("g")
    .selectAll("g")
    .data(stack().keys(keys).order(stackOrderAscending)(data))
    .join("g")
      .attr("fill", d => z(d.key))
    .selectAll("path")
    .data(d => d)
    .join("path")
      .attr("d", arcScale);

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  svg.append("g").call(legend);

  svg
    .attr("viewBox", `${-width/2} ${-height/2} ${width} ${height}`)
    .style("width", "100%")
    .style("height", "auto")
    .style("font", "10px sans-serif")
    
    

  }, [data, dimensions])

  return (
    <React.Fragment>
      <div className="presos">
        <h2>Radial Stacked Bar Chart D3</h2>
      </div>
      <div className="wrapper radialStackedView" ref={wrapperRef}>
        <svg
          className="RadialStackedBar-svg" 
          width={dimensions ? dimensions.width : 300} 
          height={dimensions ? (dimensions.height): 300}
          ref={svgRef}>
        </svg>
      </div>
    </React.Fragment>
  );
};

export default RadialStackedBarChart;