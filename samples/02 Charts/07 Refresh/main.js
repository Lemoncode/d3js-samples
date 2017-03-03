
// Let's start using ES6
// And let's organize the code following clean code concepts
// Later one we will complete a version using imports + webpack

// Isolated data array to a different file

let margin = null,
    width = null,
    height = null;

let svg = null;
let x, y = null; // scales

setupCanvasSize();
appendSvg("body");
refreshChart();
autoRefreshChart(5000);

function autoRefreshChart(miliSeconds) {
  setInterval(function() {
    refreshChart();
  }, miliSeconds);
}


function refreshChart() {
  d3.csv("data.csv", function(error, data) {  
    if (error) throw error;

    // parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");    

    data.forEach(function(d) {
          d.month = parseTime(d.month);
          d.sales = +d.sales;
      });

    clearCanvas();
    drawChart(data);
  });
}


function drawChart(totalSales) {
  setupXScale(totalSales);
  setupYScale(totalSales);
  appendXAxis(totalSales);
  appendYAxis(totalSales);
  appendLineCharts(totalSales);
}

function clearCanvas() {
  d3.selectAll("svg > g > *").remove();
}



// 1. let's start by selecting the SVG Node
function setupCanvasSize() {
  margin = {top: 20, left: 80, bottom: 20, right: 30};
  width = 960 - margin.left - margin.right;
  height = 520 - margin.top - margin.bottom;
}

function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);

}

// Now on the X axis we want to map totalSales values to
// pixels
// in this case we map the canvas range 0..350, to 0...maxSales
// domain == data (data from 0 to maxSales) boundaries
function setupXScale(totalSales)
{

  x = d3.scaleTime()
      .range([0, width])
      .domain(d3.extent(totalSales, function(d) { return d.month}));
}

// Now we don't have a linear range of values, we have a discrete
// range of values (one per product)
// Here we are generating an array of product names
function setupYScale(totalSales)
{
  var maxSales = d3.max(totalSales, function(d, i) {
    return d.sales;
  });

  y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, maxSales]);

}

function appendXAxis(totalSales) {
  // Add the X Axis
  svg.append("g")
    .attr("transform",`translate(0, ${height})`)
    .call(d3.axisBottom(x));
}

function appendYAxis(totalSales) {
  // Add the Y Axis
  svg.append("g")
  .call(d3.axisLeft(y));
}

function appendLineCharts(totalSales)
{
  // define the line
  var valueline = d3.line()
                    .x(function(d) { return x(d.month); })
                    .y(function(d) { return y(d.sales); });

  // Add the valueline path.
  svg.append("path")
  .data([totalSales])
  .attr("class", "line")
  .attr("d", valueline);
}
