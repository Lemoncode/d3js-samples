const d3 = require("d3");
import cssNames from "./bubbleChartStyles.scss";

/**
 * Module local variables.
 * @private
 */

// Chart main elements.
let data = null;
let htmlId = null;
let svg = null;
let bubbleSelection = null;

// Chart scales.
let xScale = null;
let yScale = null;
let bubbleAreaScale = null;
let bubbleClassScale = null;

// Width and Height in relative units.
// Fit the container by default unless a specific relative
// size is indicated from the caller.
const widthRel = "100%";
const heightRel = "100%";

// Chart Padding in relative units (%).
const paddingRel = {
  top: 6,
  right: 6,
  bottom: 12,
  left: 8
};

// Padding in absolute units.
let paddingAbs = {};

// Width and Height minus padding in absolute units.
let innerWidthAbs = null;
let innerHeightAbs = null;

/**
 * Helper Functions
 * @private
 */

function updateAbsoluteSize() {
  const widthAbs = parseInt(svg.style("width"), 10);
  const heightAbs = parseInt(svg.style("height"), 10);
  paddingAbs.top = Math.round(paddingRel.top * heightAbs / 100);
  paddingAbs.right = Math.round(paddingRel.right * widthAbs / 100);
  paddingAbs.bottom = Math.round(paddingRel.bottom * heightAbs / 100);
  paddingAbs.left = Math.round(paddingRel.left * widthAbs / 100);
  innerWidthAbs = widthAbs - paddingAbs.left - paddingAbs.right;
  innerHeightAbs = heightAbs - paddingAbs.top - paddingAbs.bottom;
}

function addPaddingToScale(scale, marginPercentage) {
  const span = scale.range()[1] - scale.range()[0];
  const rangeMargin = span * marginPercentage / 100;
  const newDomainMin = scale.invert(scale.range()[0] - rangeMargin);
  const newDomainMax = scale.invert(scale.range()[1] + rangeMargin);
  scale.domain([newDomainMin, newDomainMax]);
}

/**
 * Initialization Functions
 * @private
 */

function initializeSvg() {
  svg = d3.select(`#${htmlId}`)
    .append("svg")
    .attr("width", widthRel)
    .attr("height", heightRel);
  updateAbsoluteSize();
  svg = svg.append("g")
    .attr("transform", `translate(${paddingAbs.left},${paddingAbs.top})`);
}

function initializeScales() {
  // x Scale - Represents purchasing power.
  // It will better fit in log base 10. Countries will be scattered
  // in a nicer way, given that rich vs poor countries may difference
  // in several orders of magnitude.
  xScale = d3.scaleLog().base(10).nice()
    .domain(d3.extent(data, (d) => d.purchasingPower))
    .range([0, innerWidthAbs]);
  addPaddingToScale(xScale, 8);

  // y Scale - Represents life expectancy. Linear.
  yScale = d3.scaleLinear().nice()
    .domain(d3.extent(data, (d) => d.lifeExpectancy))
    .range([innerHeightAbs, 0]);
  addPaddingToScale(yScale, 5);

  // Bubble Area Scale - Represents population.
  // We want area of the circle to be scaled, however, we have radius
  // as circle property to be setup. Given that a = pi*r^2 and pi is
  // a constant factor that will not have any effect in the proportionality
  // of the relationship, we can safely say that r = sqrt(a). Thus, a
  // sqrt scale will be used.
  bubbleAreaScale = d3.scaleSqrt()
    .domain(d3.extent(data, (d) => d.population))
    .range([1, 100]);

  // Bubble Class Scale - Discrete scale to categorize per continent.
  bubbleClassScale = d3.scaleOrdinal()
    .domain(["Africa", "Asia", "Americas", "Europe", "Oceania"])
    .range([
      `${cssNames.bubble} ${cssNames.bubbleAfrica}`,
      `${cssNames.bubble} ${cssNames.bubbleAsia}`,
      `${cssNames.bubble} ${cssNames.bubbleAmerica}`,
      `${cssNames.bubble} ${cssNames.bubbleEurope}`,
      `${cssNames.bubble} ${cssNames.bubbleOceania}`
    ]);
}

function initializeAxis() {
  // X axis - Purchasing Power.
  svg.append("g")
    .attr("class", cssNames.axis)
    .attr("transform", `translate(0,${innerHeightAbs})`)
    .call(d3.axisBottom(xScale)
            .ticks(12, "$.2s")
            .tickSizeOuter(0));

  // X axis - Label
  svg.append("text")
    .attr("class", cssNames.axisLabel)
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${innerWidthAbs / 2},${innerHeightAbs + paddingAbs.bottom * 0.85})`)
    .text("Purchasing Power ($US)");

  // Y axis - Life Expectancy.
  svg.append("g")
    .attr("class", cssNames.axis)
    .call(d3.axisLeft(yScale)
            .tickSizeOuter(0));

  // Y axis - Label
  svg.append("text")
    .attr("class", cssNames.axisLabel)
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${paddingAbs.left * -0.5},${innerHeightAbs / 2})rotate(-90)`)
    .text("Life Expectancy (years)");
}

function initializeSelections() {
  bubbleSelection = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.purchasingPower))
    .attr("cy", (d) => yScale(d.lifeExpectancy))
    .attr("r", (d) => bubbleAreaScale(d.population))
    .attr("class", (d) => bubbleClassScale(d.continent));
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
  initializeSelections();
}

export {
  initialize
};
