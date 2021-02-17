import { select, scaleBand, axisBottom, stack, max, scaleLinear, axisLeft, stackOrderAscending } from 'd3';
import React, {useEffect, useRef} from 'react';
import useResizeObserver from './useResizeObserver';

const StackedBarChart = ({ data, keys, colors }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect();

    // Start Here
    const stackGenerator = stack().keys(keys).order(stackOrderAscending);
    const layers = stackGenerator(data);
    const extent = [0, max(layers, layer => max(layer, sequence => sequence[1]))];
    // console.log(extent);


    // Scales and Axis
    const xScale = scaleBand()
      .domain(data.map(d => d.label))
      .range([0, width])
      .padding(0.5);
    const xAxis = axisBottom(xScale);
    
    const yScale = scaleLinear()
      .domain([extent[0], extent[1]+1000])
      .range([height, 0])
    const yAxis = axisLeft(yScale);
    
    svg.select(".x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

    svg.select(".y-axis")
    .call(yAxis);

    //Rendering the Bars
    svg
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("class", "layer")
      .attr("fill", layer => {
        return colors[layer.key]; 
      })
      .selectAll("rect")
      .data(layer => layer)
      .join("rect")
      .attr("x", sequence => {
        return xScale(sequence.data.label);
      })
      .attr("y", sequence => {
        return yScale(sequence[1]);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", sequence => yScale(sequence[0])-yScale(sequence[1]));

  }, [data, keys, colors, dimensions]);

  return (
    <React.Fragment>
      <div className="wrapper" ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg className="stackedBar-svg" width={dimensions ? dimensions.width : 300} height={dimensions ? dimensions.height: 300} ref={svgRef}>
          <g className="x-axis"/>
          <g className="y-axis"/>
        </svg>
      </div>
    </React.Fragment>
  );

}

export default StackedBarChart;