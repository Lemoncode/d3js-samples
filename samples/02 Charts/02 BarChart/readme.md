# Barchart starting with d3js

Creating a chart from scratch it's a painful process let's see what d3js offers to us to simplify 
this process.

# Steps

- First let's create the basic HTML, in this case we will create just the SVG container.

_./index.html_

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <svg width="800" height="600">
    </svg>
  </body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.5.0/d3.min.js" charset="utf-8"></script>
  <script src="./main.js"></script>
</html>
```

- Let's define the data we want to display (sales by item):

_main.js_

```javascript
var totalSales = [
{ product: 'Hoodie', sales: 7 },
{ product: 'Jacket', sales: 6 },
{ product: 'Snuggie', sales: 9 },
];
```

- It's time to use a selector and selct the _svg_ node that we have created in the HTML:

_main.js_

```javascript
// 1. let's start by selecting the SVG Node
var svg = d3.select('svg');
```

- Now let's select all the rectangles inside that areas (right now this selection is empty)

```javascript
// 2. Now let's select all the rectangles inside that svg
// (right now is empty)
var rects = svg.selectAll('rect')
  .data(totalSales);
```

- In order to calculate the max width for the X axis on the bar chart, we need to know the max sales value we are going
to show.

```javascript
// 3. In order to calculate the max width for the X axis
// on the bar chart, we need to know the max sales value we are going
// to show.

var maxSales = d3.max(totalSales, function(d, i) {
  return d.sales;
});
```

- Now on the X axis we want to map totalSales values to pixels
in this case we map the canvas range 0..350, to 0...maxSales
domain == data (data from 0 to maxSales) boundaries
** Tip: let's play with [0, 350] values

```javascript
// Now on the X axis we want to map totalSales values to
// pixels
// in this case we map the canvas range 0..350, to 0...maxSales
// domain == data (data from 0 to maxSales) boundaries
// ** Tip: let's play with [0, 350] values
var x = d3.scaleLinear()
  .range([0, 350])
  .domain([0, maxSales]);
```

- Now we don't have a linear range of values, we have a discrete
range of values (one per product), Here we are generating an array of product names
** Tip: let's play with [0, 75] values

```javascript
// Now we don't have a linear range of values, we have a discrete
// range of values (one per product)
// Here we are generating an array of product names
// ** Tip: let's play with [0, 75] values
var y = d3.scaleBand()
  .rangeRound([0, 75])
  .domain(totalSales.map(function(d, i) {
    return d.product;
  }));
```

- Now it's time to append to the list of Rectangles we already have

```javascript
// Now it's time to append to the list of Rectangles we already have
var newRects = rects.enter();
```

- Let's append a new Rectangles
 UpperCorner:
    Starting x position, the start from the axis
    Starting y position, where the product starts on the y scale
 React width and height:
    height: the space assign for each entry (product) on the Y axis
    width: Now that we have the mapping previously done (linear)
           we just pass the sales and use the X axis conversion to
           get the right value


```javascript
newRects.append('rect')
  .attr('x', x(0))
  .attr('y', function(d, i) {
    return y(d.product);
  })
  .attr('height', y.bandwidth)
  .attr('width', function(d, i) {
    return x(d.sales);
  });
```

> **Excercise**: Let's try to this dynamic, we dont' want to stick to a given resolution, steps:

1. Create a function where you determine the size of the canvas as parameters.
2. Get the SVG widht and height and maximize size.

tips

- Wrap the create chart in a function:

```javascript
function drawBarchChart(width, height) {
```

- Get the svg width and height

```javascript
var svg = d3.select('svg');
drawBarcChart(svg._groups[0][0].clientWidth, svg._groups[0][0].clientHeight);
```


