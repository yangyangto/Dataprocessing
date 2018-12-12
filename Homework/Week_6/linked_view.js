// Name: Yang Yang To, Student Number: 10340238
// JavaScript file

window.onload = function() {

  var format = d3.format(",");

  // Set tooltips
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Life Satisfaction: </strong><span class='details'>" + format(d.Value) +"</span>";
              })

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
              width = 960 - margin.left - margin.right,
              height = 700 - margin.top - margin.bottom;

  var color = d3.scaleThreshold()
      .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
      .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

  var path = d3.geoPath();

  var svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append('g')
              .attr('class', 'map');

  var projection = d3.geoMercator()
                     .scale(130)
                    .translate( [width / 2, height / 1.5]);

  var path = d3.geoPath().projection(projection);

  svg.call(tip);

  var requests = [d3.json("world_countries.json"), d3.json('BLI3.json')];

  Promise.all(requests).then(function(response) {
    var data = response[0]
    var satisfaction = response[1]

    // console.log(data['Australia'].LOCATION)

    console.log(data)

    ready(data, satisfaction, svg, path, tip, color)

    }).catch(function(e){
        throw(e);
  });
};


function ready(data, satisfaction, svg, path, tip, color) {
  var satisfactionById = {};

  // satisfaction.forEach(function(d) { satisfactionById[d.LOCATION] = +d.Value; });
  data.features.forEach(function(d) { d.Value =satisfactionById[d.id] });

  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) {
        return color(d.id);
      })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });

  svg.append("path")
      .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path);
  };
