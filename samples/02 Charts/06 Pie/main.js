
// Let's start using ES6
// And let's organize the code following clean code concepts
// Later one we will complete a version using imports + webpack

// Isolated data array to a different file

let margin = null,
    width = null,
    height = null;

let svg = null;
let x, y = null; // scales

// helper that returns a color based on an ID
const color = d3.scaleOrdinal(d3.schemeCategory10);


setupCanvasSize();
appendSvg("body");
appendPieChart();
AppendLegend();

// 1. let's start by selecting the SVG Node
function setupCanvasSize() {
  margin = {top: 0, left: 80, bottom: 20, right: 30};
  width = 960 - margin.left - margin.right;
  height = 120 - margin.top - margin.bottom;
}

function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);

}


function appendPieChart()
{
  // Where to get the measure data
  var pie = d3.pie()
    .value(function(d) { return d.sales })

  // Calculate Arcs
  var slices = pie(totalSales);

  // Pie chart size
  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  // Draw the pie
  svg.selectAll('path.slice')
    .data(slices)
      .enter()        
        .append('path')
          .attr('class', 'slice')
          .attr('d', arc)
          .attr('fill', function(d) {
            return color(d.data.product);
          })
          .attr("transform", `translate(150, 50)`)
          ;
}

function AppendLegend() {
  // building a legend is as simple as binding
  // more elements to the same data. in this case,
  // <text> tags
  svg.append('g')
    .attr('class', 'legend')
      .selectAll('text')
      .data(totalSales)
        .enter()
          .append('text')
            .text(function(d) { return '• ' + d.product; })
            .attr('fill', function(d) { return color(d.product); })
            .attr('y', function(d, i) { return 20 * (i + 1); })  
}