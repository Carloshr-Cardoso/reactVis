import { select, arc, pie, interpolate, scaleBand, axisBottom } from 'd3';
import React, {useEffect, useRef} from 'react';
import useResizeObserver from '../../hooks/useResizeObserver';

const GaugeChart = ({ data, base }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // console.log(data);

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect();

    // Start Here
    const labels = ["Mais de 90 Dias em Prisão Provisória", "Menos de 90 Dias em Prisão Provisória"]
    const xScale = scaleBand()
      .domain(labels.map(d => d))
      .range([0, width-1])
      .padding(0.1);
    const xAxis = axisBottom(xScale);

    svg.select(".x-axis")
    .attr("transform", `translate(0, ${height-20})`)
    .call(xAxis);

    const arcGenerator = arc()
    .innerRadius((width-(width/1.15)))
    .outerRadius((width/3));

    const pieGenerator = pie()
    .startAngle(-0.5 * Math.PI)
    .endAngle(0.5*Math.PI)
    .sort(null);

    const instructions = pieGenerator(data);
    // console.log("*** components.GaugeChart.INSTRUCTIONS")
    // console.log(instructions);

    svg
      .selectAll(".caption-rect")
      .data(instructions)
      .join("rect")
      .attr("class", "caption-rect")
      .attr("width", "15")
      .attr("height", "15")
      .attr("x", "15")
      .attr("y", (instruction, index) => (index === 0 ? '15' : '40'))
      .attr("stroke", "none")
      .attr("fill", base ? "none":((instruction, index) => (index === 0 ? '#f94144' : '#90be6d')));
      
      svg
      .selectAll(".caption-text")
      .data(instructions)
      .join("text")
      .attr("class", "caption-text")
      .attr("x", "40")
      .attr("y", (instruction, index) => (index === 0 ? '28' : '53'))
      .attr("fill", base ? "none":((instruction, index) => (index === 0 ? '#f94144' : '#90be6d')))
      .attr("font-weight", "600")
      .text(base ? "none":((instruction, index) => (index === 0 ? `${(instruction.data*100).toFixed(2)}%` : `${(instruction.data*100).toFixed(2)}%`)));

    svg
      .selectAll(".slice")
      .data(instructions)
      .join("path")
      .attr("class", "slice")
      .attr("stroke", base ? "#F4A261" : "none")
      .attr("fill", base ? "none":((instruction, index) => (index === 0 ? '#f94144' : '#90be6d')))
      .style(
        "transform", `translate(${width/2}px, ${height-20}px)`
      )
      .transition()
      .attr("d", instruction => arcGenerator(instruction))
      .attrTween("d", function(nextInstruction){
        const interpolator = interpolate(this.lastIntruction, nextInstruction);
        this.lastIntruction = interpolator(1);
        return function(t){
          return arcGenerator(interpolator(t))
        }
      });

  }, [data, dimensions]);

  return (
    <React.Fragment>
      <div className="presos">
        <h2 className="gauge">Gauge Chart D3</h2>
        <div className="wrapper" ref={wrapperRef}>
          <svg
            className="stackedBar-svg" 
            width={dimensions ? dimensions.width : 300} 
            height={dimensions ? dimensions.height: 300} 
            ref={svgRef}>
              <g className="x-axis"/>
          </svg>
        </div>
      </div>
    </React.Fragment>
  );

}

export default GaugeChart;