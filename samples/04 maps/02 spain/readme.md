# Population density

Let's start with a local map (Spain) and display population per "municipality".

In this sample we will learn:
  - Where to find and how to display a country map.
  - Use a color range (plus legend).
  - Zoom on areas.
  - Place elements in a map given it's coordinates.
  - Display countries distant lands together (canary islands).

Based on the following sample: https://bl.ocks.org/martgnz/77d30f5adf890ef7465c

# Steps

- This time we are going to make ajax requests, we need to setup a lite web server (if not, chrome will block the requests as a
security request).

- Let's first execute _npm init_ (you will need nodejs installed).

```bash
npm init
```

- After filling the data requested in init (remember project name must be lowercase, contain no spaces, and do not collide with well known
library names), we are going to install _lite-server_.

```
npm install lite-server --save-dev
```

- First let's create a basic index page.

```html
<!DOCTYPE html>
<html>
  <meta charset="utf-8">
  <body>
  </body>
</html>
```

- We will include the following js/css links:
    - [External] d3 v3
    - [External] topojson: library to manage with TopoJson format (small footprint than geojson).
    - [External] rbush: RBush is a high-performance JavaScript library for 2D spatial indexing of points and rectangles
    (https://github.com/mourner/rbush)
    - [External] d3-composite-projections: Set of d3 projectins for showing countries' distant lands togehter (e.g. canary islands)
    https://github.com/rveciana/d3-composite-projections
    - [External] spamjs: A library that allow us to create zoomable maps https://github.com/newsappsio/spam
    - styles.css: styles, mainly to define the tooltip content.

> As an excercise try to migrate this project from d3 v3 to v4 (you will find that some third partie libraries
could break, time to fork a project port it and make a pull request).

```diff
<!DOCTYPE html>
<html>
  <meta charset="utf-8">
  <body>
+  <link rel="stylesheet" href="styles.css" />
+  <script src="http://d3js.org/d3.v3.min.js"></script>
+  <script src="http://d3js.org/topojson.v1.min.js"></script>  
+  <script src="https://unpkg.com/rbush@1.4.3/rbush.js"></script>
+  <script src="https://unpkg.com/d3-composite-projections@0.4.0"></script>
+  <script src="https://unpkg.com/spamjs@1.1.0/spam.min.js"></script>  
+  <script src="./main.js"></script>
   </body>
</html>
```

- Let's add now the styles css files

_./styles.css_

```css
  body {
    max-width: 960px;
    position: relative;
  }

  .g-tooltip {
    font-family: "Helvetica Neue", "Helvetica", Arial sans-serif;
    position: absolute;
    width: 200px;
    min-height: 50px;
    padding: 8px;
    font-size: 12px;
    background: rgb(255, 255, 255);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, .08);
    border-radius: 2px;
    pointer-events: none;
    z-index: 1;
  }

  .g-place {
    border-bottom: 1px solid rgb(130, 130, 130);
    margin-bottom: 5px;
    padding-bottom: 3px;
  }

  .g-headline {
    font-size: 16px;
  }

  .g-sub {
    color: rgb(130, 130, 130);
  }

  .g-value {
    float: right;
  }

  .g-legend {
    font-family: "Helvetica Neue", "Helvetica", Arial sans-serif;
    width: 300px;
    position: absolute;
    padding: 10px;
    bottom: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 2px;
  }

  .g-legendText {
    font-size: 12px;
  }

  .list-inline {
    padding-left: 0;
    list-style: none
  }

  ul {
    margin: 5px auto;
  }

  li {
    display: inline-block;
  }

  li.key {
    border-top-width: 10px;
    border-top-style: solid;
    font-size: 10px;
    width: 10%;
    height: 10px;
    padding-left: 0;
    padding-right: 0;
  }
```

- Now it's time to jump into the _main.js_ file

- First we will create an array of additional points to display (some main cities locations):

_main.js_

```javascript
var cities = [
  {
    name: "Madrid",
    coordinates: [-3.723472, 40.429348]
  },
  { name: "Barcelona", coordinates: [2.18559, 41.394579] },
  { name: "Bilbao", coordinates: [-2.930737, 43.282435] },
  { name: "Valencia", coordinates: [-0.33419, 39.494676] },
  { name: "Seville", coordinates: [-5.990362, 37.389681] },
  { name: "Santiago", coordinates: [-8.544953, 42.906538] },
  {
    name: "Santa Cruz de Tenerife",
    coordinates: [-16.251692, 28.46326]
  }
];
```

> As an excercise add Málaga and Alicante to the map.

- Let's add some declarations (hover callback, mouse coords, widht and height of the canvas)

_main.js_

```javascript
var hover = null;
var mouseX, mouseY;

var width = 960;
var height = 630;
```

- Let's define a range of colors per range of population, and a numeric format.

_main.js_

```javascript
var color = d3.scale
  .threshold()
  .domain([5, 9, 19, 49, 74, 124, 249, 499, 1000])
  .range([
    "#FEFCED",
    "#FFF8D9",
    "#FEF5BD",
    "#FFEDB8",
    "#FDE3B3",
    "#F8CFAA",
    "#F1A893",
    "#E47479",
    "#C03F58",
    "#760420"
  ]);

var format = d3.format(",4");
```

- Let's add a tooltip (it will hook under the body dom item)

```javascript
var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "g-tooltip")
  .style("opacity", 0);
```

- Let's hook on to the dom mouse move event and change the position of the tooltip when the mouse coords are changing.

```javascript
document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
  mouseX = event.pageX;
  mouseY = event.pageY;

  tooltip.style("left", mouseX - 100 + "px").style("top", mouseY + 25 + "px");
}
```

- Lets define a chart legend (styled li including the range colors)

```javascript
var legend = d3
  .select("body")
  .append("div")
  .attr("class", "g-legend")
  .append("span")
  .text("People per km2")
  .attr("class", "g-legendText");

var legendList = d3
  .select(".g-legend")
  .append("ul")
  .attr("class", "list-inline");

var keys = legendList.selectAll("li.key").data(color.range());

keys
  .enter()
  .append("li")
  .attr("class", "key")
  .style("border-top-color", String)
  .text(function (d) {
    var r = color.invertExtent(d);
    return r[0];
  });
```

- Let's load the geo info (name + path) of each municipality (_municipio_), plus the geo info (name + path) of each
regin (_comunidad autonoma_), we can find this json files in the following urls:

- Municipalities json: https://bl.ocks.org/martgnz/raw/77d30f5adf890ef7465c/municipios.json
- Regions json: https://bl.ocks.org/martgnz/raw/77d30f5adf890ef7465c/ccaa.json


```javascript
d3.json("municipios.json", function (error, d) {
  d3.json("ccaa.json", function (error, ccaa) {
  })
});
```

> This could be chained and use await as we saw in the previous sample (world_interaction) as an excercise try to refactor this code.

- Inside both functions calls, let's keep on implement it (plotting the chart), let's prepare TopoJSON for simplificatin

```diff
d3.json("municipios.json", function (error, d) {
  d3.json("ccaa.json", function (error, ccaa) {
+   topojson.presimplify(d);
+   topojson.presimplify(ccaa);
  })
});
```

- Now we will chop each call of the canvas (**do not paste it step by step just, at the end this readme we will provide the complete chunk,
this is just for explanation purpose**)

Creating a Zoomable canvas map, and adding conic conformal projection that show the canary Islands next to the iberian peninsula.

_DO NOT COPY PASTE THIS CODE, YOU CAN FIND WHOLE PIECE OF CODE AT THE BOOTOM OF THIS README_

```javascript
    var map = new ZoomableCanvasMap({
      element: "body",
      zoomScale: 0.8,
      width: width,
      height: height,
      projection: d3.geo
        .conicConformalSpain()
        .translate([width / 2 + 300, height / 2 + 100])
        .scale(960 * 4.3),
``` 

- Let's paint the municipalities shapes, we will provide a background based on rate, and after render we will paint the 
borders of each municipality (it will be displayed on hover)

_DO NOT COPY PASTE THIS CODE, YOU CAN FIND WHOLE PIECE OF CODE AT THE BOOTOM OF THIS README_
```javascript
      data: [
        {
          features: topojson.feature(d, d.objects["municipios"]),
          static: {
            paintfeature: function (parameters, d) {
              parameters.context.fillStyle = color(d.properties.rate);
              parameters.context.fill();
            },
            postpaint: function (parameters) {
              var p = new Path2D(parameters.projection.getCompositionBorders());

              parameters.context.lineWidth = 0.5;
              parameters.context.strokeStyle = "#555";
              parameters.context.stroke(p);
            }
          },
```

- Let's add tooltip support:

_DO NOT COPY PASTE THIS CODE, YOU CAN FIND WHOLE PIECE OF CODE AT THE BOOTOM OF THIS README_

```javascript
          dynamic: {
            postpaint: function (parameters) {
              if (!hover) {
                tooltip.style("opacity", 0);
                return;
              }

              parameters.context.beginPath();
              parameters.context.lineWidth = 1.5 / parameters.scale;
              parameters.path(hover);
              parameters.context.stroke();

              tooltip
                .style("opacity", 1)
                .html(
                "<div class='g-place'>" +
                "<span class='g-headline'>" +
                hover.properties.name +
                "</span>" +
                "</div>" +
                "<span>Density</span>" +
                "<span class='g-value'>" +
                format(hover.properties.rate) +
                " per km2</span>"
                );
            }
          },

```

- On mouse hover let's repaint the map (paint broders plus updated tooltip):

_DO NOT COPY PASTE THIS CODE, YOU CAN FIND WHOLE PIECE OF CODE AT THE BOOTOM OF THIS README_
```javascript
        events: {
          hover: function (parameters, d) {
            hover = d;

            parameters.map.paint();
          }
        }
```

- 

-  Now let's paint the regions:

_DO NOT COPY PASTE THIS CODE, YOU CAN FIND WHOLE PIECE OF CODE AT THE BOOTOM OF THIS README_
```javascript
        {
          features: topojson.feature(ccaa, ccaa.objects["ccaa"]),
          static: {
            paintfeature: function (parameters, d) {
              parameters.context.lineWidth = 0.5 / parameters.scale;
              parameters.context.strokeStyle = "rgb(130,130,130)";
              parameters.context.stroke();
            },
```

- And finally let's pain the list of main cities:

_DO NOT COPY PASTE THIS CODE, YOU CAN FIND WHOLE PIECE OF CODE AT THE BOOTOM OF THIS README_
```javascript
            postpaint: function (parameters) {
              for (var i in cities) {
                // Assign the cities to a variable for a cleaner access
                var city = cities[i];

                // Project the coordinates into our Canvas map
                var projectedPoint = parameters.projection(city.coordinates);

                // Create the label dot
                parameters.context.beginPath();

                parameters.context.arc(
                  projectedPoint[0],
                  projectedPoint[1],
                  2 / parameters.scale,
                  0,
                  2 * Math.PI,
                  true
                );

                // Font properties
                var fontSize = 11 / parameters.scale;
                parameters.context.textAlign = "center";
                parameters.context.font = fontSize + "px sans-serif";

                // Create the text shadow
                parameters.context.shadowColor = "black";
                parameters.context.shadowBlur = 5;
                parameters.context.lineWidth = 1 / parameters.scale;
                parameters.context.strokeText(
                  city.name,
                  projectedPoint[0],
                  projectedPoint[1] - 7 / parameters.scale
                );

                // Paint the labels
                parameters.context.fillStyle = "white";
                parameters.context.fillText(
                  city.name,
                  projectedPoint[0],
                  projectedPoint[1] - 7 / parameters.scale
                );

                parameters.context.fill();
              }
            }
          },
```

- It's time to define the zoom behavior when we click on the map, and initialize the map:

_DO NOT COPY PASTE THIS CODE, YOU CAN FIND WHOLE PIECE OF CODE AT THE BOOTOM OF THIS README_
```
          events: {
            click: function (parameters, d) {
              parameters.map.zoom(d);
            }
          }
        }
      ]
    });
    map.init();
```

- Complete chunk


_main.js_
_COMPLETE CHUNK INSERT RIGHT AFTER toposon.presimplify call_

```javascript
    var map = new ZoomableCanvasMap({
      element: "body",
      zoomScale: 0.8,
      width: width,
      height: height,
      projection: d3.geo
        .conicConformalSpain()
        .translate([width / 2 + 300, height / 2 + 100])
        .scale(960 * 4.3),
      data: [
        {
          features: topojson.feature(d, d.objects["municipios"]),
          static: {
            paintfeature: function (parameters, d) {
              parameters.context.fillStyle = color(d.properties.rate);
              parameters.context.fill();
            },
            postpaint: function (parameters) {
              var p = new Path2D(parameters.projection.getCompositionBorders());

              parameters.context.lineWidth = 0.5;
              parameters.context.strokeStyle = "#555";
              parameters.context.stroke(p);
            }
          },
          dynamic: {
            postpaint: function (parameters) {
              if (!hover) {
                tooltip.style("opacity", 0);
                return;
              }

              parameters.context.beginPath();
              parameters.context.lineWidth = 1.5 / parameters.scale;
              parameters.path(hover);
              parameters.context.stroke();

              tooltip
                .style("opacity", 1)
                .html(
                "<div class='g-place'>" +
                "<span class='g-headline'>" +
                hover.properties.name +
                "</span>" +
                "</div>" +
                "<span>Density</span>" +
                "<span class='g-value'>" +
                format(hover.properties.rate) +
                " per km2</span>"
                );
            }
          },
          events: {
            hover: function (parameters, d) {
              hover = d;

              parameters.map.paint();
            }
          }
        },
        {
          features: topojson.feature(ccaa, ccaa.objects["ccaa"]),
          static: {
            paintfeature: function (parameters, d) {
              parameters.context.lineWidth = 0.5 / parameters.scale;
              parameters.context.strokeStyle = "rgb(130,130,130)";
              parameters.context.stroke();
            },
            postpaint: function (parameters) {
              for (var i in cities) {
                // Assign the cities to a variable for a cleaner access
                var city = cities[i];

                // Project the coordinates into our Canvas map
                var projectedPoint = parameters.projection(city.coordinates);

                // Create the label dot
                parameters.context.beginPath();

                parameters.context.arc(
                  projectedPoint[0],
                  projectedPoint[1],
                  2 / parameters.scale,
                  0,
                  2 * Math.PI,
                  true
                );

                // Font properties
                var fontSize = 11 / parameters.scale;
                parameters.context.textAlign = "center";
                parameters.context.font = fontSize + "px sans-serif";

                // Create the text shadow
                parameters.context.shadowColor = "black";
                parameters.context.shadowBlur = 5;
                parameters.context.lineWidth = 1 / parameters.scale;
                parameters.context.strokeText(
                  city.name,
                  projectedPoint[0],
                  projectedPoint[1] - 7 / parameters.scale
                );

                // Paint the labels
                parameters.context.fillStyle = "white";
                parameters.context.fillText(
                  city.name,
                  projectedPoint[0],
                  projectedPoint[1] - 7 / parameters.scale
                );

                parameters.context.fill();
              }
            }
          },
          events: {
            click: function (parameters, d) {
              parameters.map.zoom(d);
            }
          }
        }
      ]
    });
    map.init();
```

> This code could be enhanced and some parts could be even be reusable assets, as an excercise try to play with this
and come with a cleaner implementation.