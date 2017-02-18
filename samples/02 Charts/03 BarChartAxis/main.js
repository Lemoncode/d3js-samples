var totalSales = [
{ product: 'Hoodie', sales: 7 },
{ product: 'Jacket', sales: 6 },
{ product: 'Snuggie', sales: 9 },
];


// 1. let's start by selecting the SVG Node
var margin = {top: 0, left: 80, bottom: 20, right: 0};
var width = 960 - margin.left - margin.right;
var height = 120 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
            ;

var barChartsGroup = svg.append("g");

//barChartsGroup.attr("transform", "translate(" + margin.left + ",0)");

// 2. Now let's select all the rectangles inside that svg
// (right now is empty)
var rects = barChartsGroup.selectAll('rect')
  .data(totalSales);


// 3. In order to calculate the max width for the X axis
// on the bar chart, we need to know the max sales value we are going
// to show.

var maxSales = d3.max(totalSales, function(d, i) {
  return d.sales;
});

// Now on the X axis we want to map totalSales values to
// pixels
// in this case we map the canvas range 0..350, to 0...maxSales
// domain == data (data from 0 to maxSales) boundaries
// ** Tip: let's play with [0, 350] values
var x = d3.scaleLinear()
  .range([0, 350])
  .domain([0, maxSales]);

// Now we don't have a linear range of values, we have a discrete
// range of values (one per product)
// Here we are generating an array of product names
// ** Tip: let's play with [0, 75] values
var y = d3.scaleBand()
  .rangeRound([0, height])
  .domain(totalSales.map(function(d, i) {
    return d.product;
  }));



// Now it's time to append to the list of Rectangles we already have
var newRects = rects.enter();

// Let's append a new Rectangles
// UpperCorner:
//    Starting x position, the start from the axis
//    Starting y position, where the product starts on the y scale
// React width and height:
//    height: the space assign for each entry (product) on the Y axis
//    width: Now that we have the mapping previously done (linear)
//           we just pass the sales and use the X axis conversion to
//           get the right value
newRects.append('rect')
  .attr('x', x(0))
  .attr('y', function(d, i) {
    return y(d.product);
  })
  .attr('height', y.bandwidth)
  .attr('width', function(d, i) {
    return x(d.sales);
  });

  // Add the X Axis
  svg.append("g")
    .attr("transform", "translate(0,"+ height +")")
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
  .call(d3.axisLeft(y));
