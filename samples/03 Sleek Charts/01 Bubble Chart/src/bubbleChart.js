const d3 = require("d3");

/**
 * Module local variables.
 * @private
 */
let data;
let htmlId;
let svg;

// Setup sizes.
// TODO: I dont like working with absolute units. Research how to
// work in relative vh and vw.
const marginRel = {top: 8, right: 6, bottom: 20, left: 6};
const widthRel = "80vw";
const heightRel = "80vh";
// Margins in absolute units.
let marginAbs = {top: 0, right: 0, bottom: 0, left: 0};
// Width and Height without margins in absolute units.
let widthAbs;
let heightAbs;

function updateAbsoluteSize() {
  widthAbs = parseInt(svg.style("width"), 10);
  heightAbs = parseInt(svg.style("height"), 10);
  marginAbs.top = Math.round(marginRel.top * heightAbs / 100);
  marginAbs.right = Math.round(marginRel.right * widthAbs / 100);
  marginAbs.bottom = Math.round(marginRel.bottom * heightAbs / 100);
  marginAbs.left = Math.round(marginRel.left * widthAbs / 100);
  widthAbs = widthAbs - marginAbs.left - marginAbs.right;
  heightAbs = heightAbs - marginAbs.top - marginAbs.bottom;
}

function initializeSvg() {
  svg = d3.select(`#${htmlId}`)
    .append("svg")
    .attr("width", widthRel)
    .attr("height", heightRel);
  updateAbsoluteSize();
  svg = svg.append("g")
    .attr("transform", "translate(" + marginAbs.left + "," + marginAbs.top + ")");
}


function rest() {
  // Create scales.
  // x scale -> Life Expectancy
  let xScale = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.lifeExpectancy))
    .range([0, widthAbs]);

  let yScale = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.purchasingPower))
    .range([heightAbs, 0]);

  let radiusScale = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.population))
    .range([10, 100]);

  // Establish selection.
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.lifeExpectancy))
    .attr("cy", (d) => yScale(d.purchasingPower))
    .attr("r", (d) => radiusScale(d.population));
}

function initialize(dataset, htmlElementId) {
  data = dataset;
  htmlId = htmlElementId;

  initializeSvg();
  rest();
}

export {
  initialize
};
