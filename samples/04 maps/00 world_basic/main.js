var width = 960;
var height = 500;

var svg = d3.select("body").append("svg");

// Project choose how to project a point on a sphere (e.g. the earth)
// to a point on a flat surface (e.g. a screen)
var projection = d3.geoMercator()
  .scale(width / 2 / Math.PI)
  //.scale(100)
  .translate([width / 2, height / 2]);

// Path generator, transform GeoJSON into an SVG path string
  var path = d3.geoPath()
  .projection(projection);

// read geojson file from a remote url  
// if we use topojson file use to take 80% less space
  var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
  d3.json(url, function(err, geojson) {
    svg.append("path")
      .attr("d", path(geojson));
  });