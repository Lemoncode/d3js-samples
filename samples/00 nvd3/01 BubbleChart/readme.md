# nvd3 Bubble Chart

Let's finish our third parties libraries startup by creating a simple bubble chart (nvd3).

# Steps to reproduce the sample

This time we will just create the HTML in one go (you can find a step by step detailed guide in the previous sample).

> This time we will include directly all the libs, plus data and main js files, we are including as well an SVG shape in 
the div container

_./index.html_

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.5/nv.d3.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js" charset="utf-8"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.5/nv.d3.js"></script>
  <script src="./data.js"></script>
  <script src="./main.js"></script>
  
  <style>
    text {
      font: 12px sans-serif;
    }

    svg {
      display: block;
    }

    html,
    body,
    #test1,
    svg {
      margin: 0px;
      padding: 0px;
      height: 100%;
      width: 100%;
    }
  </style>
</head>

<body>

  <div id="test1" class='with-3d-shadow with-transitions'>
    <svg></svg>
  </div>
</body>

</html>
```

- Now it's time to go through defining the data:
    - We are going to define an array of shapes (one of the shapes will be custom).
    - The we are going to add random values + shapes, in a loop following the format:

```json
{
  x: number,
  y: number,
  size: number,
  shape: string  
}
```

_./data.js_

```javascript
function randomData(groups, points) { //# groups,# points per group
  // smiley and thin-x are our custom symbols!
  var data = [],
      shapes = ['thin-x', 'circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
      random = d3.random.normal();

  for (i = 0; i < groups; i++) {
      data.push({
          key: 'Group ' + i,
          values: []
      });

      for (j = 0; j < points; j++) {
          data[i].values.push({
              x: random(),
              y: random(),
              size: Math.round(Math.random() * 100) / 100,
              shape: shapes[j % shapes.length]
          });
      }
  }

  return data;
}
```

- Moving into the defining chart section, first let's define a custom shape (svg).

_./main.js_

```javascript
// register our custom symbols to nvd3
// make sure your path is valid given any size because size scales if the chart scales.
nv.utils.symbolMap.set('thin-x', function(size) {
  size = Math.sqrt(size);
  return 'M' + (-size/2) + ',' + (-size/2) +
          'l' + size + ',' + size +
          'm0,' + -(size) +
          'l' + (-size) + ',' + size;
});
```

- Let's add our AddGraph funnction:

_./main.js_

```javascript
  // create the chart
  var chart;
  nv.addGraph(function() {
  });
```

- Let's define the chart

_./main.js_

```diff
  // create the chart
  var chart;
  nv.addGraph(function() {
+    chart = nv.models.scatterChart()
+        .showDistX(true)
+        .showDistY(true)
+        .useVoronoi(true)
+        .color(d3.scale.category10().range())
+        .duration(300)
+    ;
  });
```

- Let's provide the tick format to X and Y axis.

```diff
var chart;
nv.addGraph(function () {
  chart = nv.models.scatterChart()
    .showDistX(true)
    .showDistY(true)
    .useVoronoi(true)
    .color(d3.scale.category10().range())
    .duration(300)
    ;

+    chart.xAxis.tickFormat(d3.format('.02f'));
+    chart.yAxis.tickFormat(d3.format('.02f'));
});
```

- Now let's instantiate the chart and place it in the svg placeholder that we have previously defined in the html,
we are hooking as well to windowsResize to update the chart layout whenever the browser window changes it's width or height.

```diff
// create the chart
var chart;
nv.addGraph(function () {
  chart = nv.models.scatterChart()
    .showDistX(true)
    .showDistY(true)
    .useVoronoi(true)
    .color(d3.scale.category10().range())
    .duration(300)
    ;

    chart.xAxis.tickFormat(d3.format('.02f'));
    chart.yAxis.tickFormat(d3.format('.02f'));

+      d3.select('#test1 svg')
+          .datum(randomData(4,40))
+          .call(chart);

+      nv.utils.windowResize(chart.update);
      
+      return chart;
});
```

> Excercise: Let's customize our scattered chart, entry data (Ice Cream Sales vs Temperature):

| Temperature   | Sales   |
| ------------- |:-------:|
| 14.2 C        | $215    |
| 16.4 C        | $325    |
| 11.9 C        | $185    |
| 15.2 C        | $332    |
| 18.5 C        | $406    |
| 22.1 C        | $522    |
| 19.4 C        | $412    |
| 25.1 C        | $614    |
| 23.4 C        | $544    |
| 18.1 C        | $421    |
| 22.6 C        | $445    |
| 17.2 C        | $408    |

Challenges:

 - Create the right JSON structure.
 - Enrich the chart using shapes (e.g. if a given entry is above 400$ use a shape if it's below 200$ another one).
 - Display the data
 - Adjust X and Y Axis





