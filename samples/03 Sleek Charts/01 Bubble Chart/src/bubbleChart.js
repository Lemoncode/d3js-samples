const d3 = require("d3");

/**
 * Module local variables.
 * @private
 */

// Chart main elements.
let data = null;
let htmlId = null;
let svg = null;

// Chart scales.
let xScale = null;
let yScale = null;
let bubbleAreaScale = null;
let bubbleColorScale = null;
let bubbleColorOpacity = 0.6;

// Margins in relative units.
const marginRel = {
  top: 6,
  right: 6,
  bottom: 8,
  left: 8
};

// Width and Height with margins in relative units.
const widthRel = "80vw";
const heightRel = "80vh";

// Margins in absolute units.
let marginAbs = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

// Width and Height without margins in absolute units.
let widthAbs = null;
let heightAbs = null;

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
    .attr("transform", `translate(${marginAbs.left},${marginAbs.top})`);
}


function initializeScales() {

  // x Scale - Represents purchasing power.
  // It will better fit in log base 10. Countries will be scattered
  // in a nicer way, given that rich vs poor countries may difference
  // in several orders of magnitude.
  xScale = d3.scaleLog().base(10).nice()
    .domain(d3.extent(data, (d) => d.purchasingPower))
    .range([0, widthAbs]);
    

  // y Scale - Represents life expectancy. Linear.
  yScale = d3.scaleLinear().nice()
    .domain(d3.extent(data, (d) => d.lifeExpectancy))
    .range([heightAbs, 0]);

  // Bubble Area Scale - Represents population.
  // We want area of the circle to be scaled, however, we have radius
  // as circle property to be setup. Given that a = pi*r^2 and pi is
  // a constant factor that will not have any effect in the proportionality
  // of the relationship, we can safely say that r = sqrt(a). Thus, a
  // sqrt scale will be used.
  bubbleAreaScale = d3.scaleSqrt()
    .domain(d3.extent(data, (d) => d.population))
    .range([1, 100]);

  // Bubble Color Scale - Discrete scale to represent continent.
  bubbleColorScale = d3.scaleOrdinal()
    .domain(["Africa", "Asia", "Americas", "Europe", "Oceania"])
    .range([
      d3.rgb(102, 194, 165),
      d3.rgb(128, 177, 211),
      d3.rgb(251, 128, 114),
      d3.rgb(231, 41, 138),
      d3.rgb(231, 138, 195)
    ]);
}

function initializeAxis() {
  // X axis - Purchasing Power.
  svg.append("g")
    .attr("transform", `translate(0,${heightAbs})`)
    .call(d3.axisBottom(xScale).ticks(10, "$.2s"));

  // Y axis - Life Expectancy.
  svg.append("g")
    .call(d3.axisLeft(yScale));
}


function initializeSelection() {
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.purchasingPower))
    .attr("cy", (d) => yScale(d.lifeExpectancy))
    .attr("r", (d) => bubbleAreaScale(d.population))
    .attr("fill", (d) => bubbleColorScale(d.continent))
    .attr("fill-opacity", bubbleColorOpacity);
}

/**
 * Initialize Chart
 * @public
 * @param  {type} dataset            {description}
 * @param  {type} htmlElementId      {description}
 * @param  {type} width = widthRel   {OPTIONAL. Supports relative units.}
 * @param  {type} height = heightRel {OPTIONAL. Supports relative units.}
 * @return {type} {description}
 */
function initialize(dataset, htmlElementId, width = widthRel, height = heightRel) {
  data = dataset;
  htmlId = htmlElementId;
  widthRel = width;
  heightRel = height;

  initializeSvg();
  initializeScales();
  initializeAxis();
  initializeSelection();
}

export {
  initialize
};
