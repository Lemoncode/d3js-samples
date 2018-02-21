# Getting Started with maps

Let's start creating maps.

A good reading to get started: 

http://d3indepth.com/geographic/

https://bost.ocks.org/mike/map/

https://www.toptal.com/javascript/a-map-to-perfection-using-d3-js-to-make-beautiful-web-maps

In our samples we will just have the simplfied JSON geo coords entries already cooked and consume it via topojson,
you can find many contributions in github including many different areas converted to json.

This map is based on the following samples:
http://bl.ocks.org/almccon/fe445f1d6b177fd0946800a48aa59c71


# Steps

- Let's create a basic index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <style>
      body { margin:0;position:fixed;top:0;right:0;bottom:0;left:0; }
      svg { width:100%; height: 100% }
    </style>    
  </head>
  <body>
  </body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.5.0/d3.min.js" charset="utf-8"></script>
  <script src="./main.js" charset="utf-8"></script>
</html>
```

- Now let's append an svg to the body and define width and height.

```javascript
var width = 960;
var height = 500;

var svg = d3.select("body").append("svg")
```

- Project choose how to project a point on a sphere (e.g. the earth)
to a point on a flat surface (e.g. a screen):

```javascript
var projection = d3.geoMercator()
  .scale(width / 2 / Math.PI)
  //.scale(100)
  .translate([width / 2, height / 2])
```

- Path generator, transform GeoJSON into an SVG path string.

```javascript
var path = d3.geoPath()
              .projection(projection);
```

- Read geojson file from a remote url, if we use topojson file use to take 80% less space.

```javascript
  var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
  d3.json(url, function(err, geojson) {
    svg.append("path")
      .attr("d", path(geojson))
  })
```





