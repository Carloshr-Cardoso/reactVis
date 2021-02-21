import { select, scaleBand, axisBottom, stack, max, scaleLinear, axisLeft, stackOrderAscending } from 'd3';
import React, {useEffect, useRef} from 'react';
import useResizeObserver from '../../hooks/useResizeObserver';

const StackedColumnChart = ({ data, keys, colors }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  // console.log("*** Components.StackedBarChart.DATA ***")
  // console.log(data)

  useEffect(() => {
    const svg = select(svgRef.current);
    const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect();

    // Start Here
    const stackGenerator = stack().keys(keys).order(stackOrderAscending);
    const layers = stackGenerator(data);
    // console.log(layers[0][0][0]);
    const extent = [0, max(layers, layer => max(layer, sequence => sequence[1]))];
    // console.log(extent);

    svg
    .selectAll(".caption-rect")
    .data(layers)
    .join("rect")
    .attr("class", "caption-rect")
    .attr("width", "15")
    .attr("height", "15")
    .attr("x", "15")
    .attr("y", (layer, index) => (index === 0 ? '15' : '40'))
    .attr("stroke", "none")
    .attr("fill", layers[0][0][0] ? ((layer, index) => (index === 0 ? colors[layer.key] : colors[layer.key])) : "none");
    
    svg
    .selectAll(".caption-text")
    .data(layers)
    .join("text")
    .attr("class", "caption-text")
    .attr("x", "40")
    .attr("y", (layer, index) => (index === 0 ? '28' : '53'))
    .attr("fill", ((layer, index) => (index === 0 ? colors[layer.key] : colors[layer.key])))
    .attr("font-weight", "600")
    .text(layers[0][0][0] ? ((layer, index) => (index === 0 ? layer.key : layer.key)) : null);


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

      // console.log((sequence) => yScale(sequence[0])-yScale(sequence[1]))

  }, [data, keys, colors, dimensions]);

  return (
    <React.Fragment>
      <div className="presos">
        {/* <h2>Stacked Bar Chart D3</h2> */}
        <div className="wrapper" ref={wrapperRef} style={{ marginBottom: "2rem" }}>
          <svg className="stackedBar-svg" width={dimensions ? dimensions.width : 300} height={dimensions ? dimensions.height: 300} ref={svgRef}>            
            <g className="x-axis"/>
            <g className="y-axis"/>
          </svg>
        </div>
      </div>
    </React.Fragment>
  );

}

export default StackedColumnChart;