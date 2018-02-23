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

var hover = null;
var mouseX, mouseY;

var width = 960;
var height = 630;

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

var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "g-tooltip")
  .style("opacity", 0);

document.onmousemove = (event)=>{
  mouseX = event.pageX;
  mouseY = event.pageY;

  tooltip.style("left", `${mouseX - 100}px`).style("top", `${mouseY + 25}px`);
}

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
  .text( d => color.invertExtent(d)[0]);


Promise.all([
  fetch("municipios.json"),
  fetch("ccaa.json")
]).then(responses=>{
  ready(responses[0],responses[1]);
}).catch((error)=>{
  throw error;
});


function ready (d,ccaa){
  topojson.presimplify(d);
  topojson.presimplify(ccaa);
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
          paintfeature: (parameters, d) => {
            parameters.context.fillStyle = color(d.properties.rate);
            parameters.context.fill();
          },
          postpaint: parameters => {
            var p = new Path2D(parameters.projection.getCompositionBorders());
            parameters.context.lineWidth = 0.5;
            parameters.context.strokeStyle = "#555";
            parameters.context.stroke(p);
          }
        },
        dynamic: {
          postpaint: parameters=> {
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
              `<div class='g-place'>
                <span class='g-headline'>
                  ${hover.properties.name}
                </span> 
              </div>
              <span>Density</span>
              <span class='g-value'>
                ${format(hover.properties.rate)} per km2
              </span>`
              );
          }
        },
        events: {
          hover:  (parameters, d)=> {
            hover = d;
            parameters.map.paint();
          }
        }
      },
      {
        features: topojson.feature(ccaa, ccaa.objects["ccaa"]),
        static: {
          paintfeature: (parameters, d) => {
            parameters.context.lineWidth = 0.5 / parameters.scale;
            parameters.context.strokeStyle = "rgb(130,130,130)";
            parameters.context.stroke();
          },
          postpaint: parameters =>{
            cities.forEach( city=>{
              
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
              parameters.context.textAlign = "center";
              parameters.context.font=`${11/parameters.scale}px sans-serif`;
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
            });
        
          }
        },
        events: {
          click:  (parameters, d) =>{
            parameters.map.zoom(d);
          }
        }
      }
    ]
  });
  map.init();
}

/*
d3.json("municipios.json", function (error, d) {
  d3.json("ccaa.json", function (error, ccaa) {
    
  });
});*/