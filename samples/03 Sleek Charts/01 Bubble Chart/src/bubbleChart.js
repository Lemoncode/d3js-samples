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
let chart = null;
let bubbleSelection = null;
let infoPopup = null;

// Chart scales.
let xScale = null;
let yScale = null;
let bubbleAreaScale = null;
let continentScale = null;

// Width and Height in relative units.
// Fit the container by default unless a specific relative
// size is indicated from the caller.
const widthRel = "100%";
const heightRel = "100%";

// Chart Padding in relative units (rem).
// Given that padding is intended to allocate axis labels, it makes
// sense that it is expressed in relative units refering to font size.
const paddingRel = {
  top: 4,
  right: 1,
  bottom: 4,
  left: 4
};
let fontSizeAbs = null;

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
  // const displayScalingFactor = window.devicePixelRatio;
  fontSizeAbs = parseInt(getComputedStyle(document.body).fontSize, 10);
  paddingAbs.top = Math.round(paddingRel.top * fontSizeAbs);
  paddingAbs.right = Math.round(paddingRel.right * fontSizeAbs);
  paddingAbs.bottom = Math.round(paddingRel.bottom * fontSizeAbs);
  paddingAbs.left = Math.round(paddingRel.left * fontSizeAbs);
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

function initializeChart() {
  svg = d3.select(`#${htmlId}`)
    .append("svg")
    .attr("width", widthRel)
    .attr("height", heightRel);
  updateAbsoluteSize();
  chart = svg.append("g")
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

  // Continent Scale - Discrete scale to categorize per continent.
  continentScale = d3.scaleOrdinal()
    .domain(["Africa", "Asia", "Americas", "Europe", "Oceania"])
    .range([
      `${cssNames.continentAfrica}`,
      `${cssNames.continentAsia}`,
      `${cssNames.continentAmerica}`,
      `${cssNames.continentEurope}`,
      `${cssNames.continentOceania}`
    ]);
}

function initializeAxis() {
  // X axis - Purchasing Power.
  chart.append("g")
    .attr("class", cssNames.axis)
    .attr("transform", `translate(0,${innerHeightAbs})`)
    .call(d3.axisBottom(xScale)
      .ticks(Math.max(innerWidthAbs / (fontSizeAbs * 5), 2), "$.2s")
      .tickSizeOuter(0));

  // Y axis - Life Expectancy.
  chart.append("g")
    .attr("class", cssNames.axis)
    .call(d3.axisLeft(yScale)
      .tickSizeOuter(0));
}

function initializeLabels() {
  // X axis - Label
  chart.append("text")
    .attr("class", cssNames.axisTitle)
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${innerWidthAbs / 2},${innerHeightAbs + paddingAbs.bottom * 0.7})`)
    .text("Purchasing Power ($US)");

  // Y axis - Label
  chart.append("text")
    .attr("class", cssNames.axisTitle)
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${paddingAbs.left * -0.5},${innerHeightAbs / 2})rotate(-90)`)
    .text("Life Expectancy (years)");

  // Title
  chart.append("text")
    .attr("class", cssNames.mainTitle)
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${innerWidthAbs / 2},${paddingAbs.top * -0.3})`)
    .text("Wealth Distribution per Country");
}

function updatePositionInfoPopup() {
  infoPopup
    .style("left", `${d3.event.pageX - (infoPopup.node().getBoundingClientRect().width / 2)}px`)
    .style("top", `${d3.event.pageY - parseInt(infoPopup.style("height"), 0) - 5}px`);
}

function showInfoPopup(itemData) {
  infoPopup = infoPopup.html(
    `
    <table>
      <tr>
        <th class="${cssNames.infoPopupCaption}">${itemData.country}</th>
        <th class="${cssNames.infoPopupSubcaption} ${continentScale(itemData.continent)}">${itemData.continent}</th>
      </tr>
      <tr>
        <td class="${cssNames.infoPopupData}">${itemData.purchasingPower.toLocaleString()}</td>
        <td class="${cssNames.infoPopupUnits}"><small>$</small></td>
      </tr>
      <tr>
        <td class="${cssNames.infoPopupData}">${itemData.lifeExpectancy.toLocaleString()}</td>
        <td class="${cssNames.infoPopupUnits}"><small>Years</small></td>
      </tr>
      <tr>
        <td class="${cssNames.infoPopupData}">${itemData.population.toLocaleString()}</td>
        <td class="${cssNames.infoPopupUnits}"><small>Inhabitants<small></td>
      </tr>
    </table>
  `
  );  
  updatePositionInfoPopup();
  infoPopup.style("opacity", 0.9);
}

function hideInfoPopup() {
  infoPopup.style("opacity", 0);
}

function initializeInfoPopup() {
  if (!infoPopup) {
    infoPopup = d3.select(`#${htmlId}`)
      .append("div")
      .attr("class", cssNames.infoPopup);
  }
}

// Very useful to render small bubbles on top of big ones.
// Emulates z-index in chart canvas.
function sortBubbleSelection() {
  return bubbleSelection.sort((a, b) => {
    return (b.population - a.population);
  });
}

function initializeSelections() {
  bubbleSelection = chart.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.purchasingPower))
    .attr("cy", (d) => yScale(d.lifeExpectancy))
    .attr("r", (d) => bubbleAreaScale(d.population))
    .attr("class", (d) => `${cssNames.bubble} ${continentScale(d.continent)}`)
    .on("mouseenter", showInfoPopup)
    .on("mousemove", updatePositionInfoPopup)
    .on("mouseleave", hideInfoPopup);
  bubbleSelection = sortBubbleSelection();
}

function initializeChartElements() {
  initializeChart();
  initializeScales();
  initializeAxis();
  initializeLabels();
  initializeInfoPopup();
  initializeSelections()
}

/**
 * This function launches the chart rendering. 
 * @public
 * @return {void}
 */
function draw() {
  // TODO: Although effective, this is not very efficient.
  // It was done to support resizing the quickest way.
  // There is room for improvement here.
  if (htmlId) {
    if (svg) {
      svg.remove();
    }
    initializeChartElements();
  }
}

/**
 * Initialize a new bubble Chart inside the corresponding
 * html element for a given dataset.
 * @public
 * @param  {array} dataset           {Countries stats dataset.}
 * @param  {type} htmlElementId      {ID of the html element where chart will be drawn.}
 * @param  {type} width = widthRel   {OPTIONAL. Supports relative units. 100% by default.}
 * @param  {type} height = heightRel {OPTIONAL. Supports relative units. 100% by default.}
 * @return {void}
 */
function initialize(dataset, htmlElementId, width = widthRel, height = heightRel) {
  data = dataset;
  htmlId = htmlElementId;
  widthRel = width;
  heightRel = height;
}

export {
  initialize,
  draw
};
