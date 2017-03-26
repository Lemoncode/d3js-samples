import * as Parser from "./delimitedDataParser.js";
const d3 = require("d3");

function fetchData() {
  Parser.setup("\t", "\r\n", true);
  Parser.parse("./data.txt",
    (parsedData, htmlTable) => {
      document.getElementById("dataTable").innerHTML = htmlTable;
      drawGraph(parsedData);
    },
    (message) => {
      document.getElementById("dataTable").innerHTML = message;
    });
}

fetchData();

function drawGraph(countryStats) {
  // Setup sizes.
  // TODO: I dont like working with absolute units. Research how to
  // work in relative vh and vw.
  const margin = {top: 20, left: 80, bottom: 20, right: 30};
  const width = 960 - margin.left - margin.right;
  const height = 520 - margin.top - margin.bottom;

  // Create SVG element.
  let svg = d3.select("#bubbleChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create scales.
  // x scale -> Life Expectancy
  let xScale = d3.scaleLinear()
    .domain(d3.extent(countryStats, (d) => d.lifeExpectancy))
    .range([0, width]);
    
  let yScale = d3.scaleLinear()
    .domain(d3.extent(countryStats, (d) => d.purchasingPower))
    .range([height, 0]);
  
  let radiusScale = d3.scaleLinear()
    .domain(d3.extent(countryStats, (d) => d.population))
    .range([10, 100]);

  // Establish selection.
  svg.selectAll("circle")
    .data(countryStats)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.lifeExpectancy))
    .attr("cy", (d) => yScale(d.purchasingPower))
    .attr("r", (d) => radiusScale(d.population));
}
