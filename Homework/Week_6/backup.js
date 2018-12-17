// Name: Yang Yang To, Student Number: 10340238
// JavaScript file

window.onload = function() {

  var format = d3.format(",");

  // Set tooltips
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return ("<strong>Country: </strong><span class='details'>" +
                        d.properties.name + "<br></span>" +
                        "<strong>Life Satisfaction: </strong><span class='details'>" +
                        format(d.Value) +"</span>");
              })

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
              width = 800 - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

  var color = d3.scaleThreshold()
      .domain([4, 5,7, 6, 8])
      .range(['#bfd3e6', '#9ebcda', '#8c96c6', '#8856a7', '#810f7c']);

  var path = d3.geoPath();

  var svg = d3.select("#map")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append('g')
              .attr('class', 'map');

  var projection = d3.geoMercator()
                     .scale(120)
                    .translate( [width / 2.0, height / 1.33]);

  var path = d3.geoPath().projection(projection);

  svg.call(tip);

  var requests = [d3.json("world_countries.json"), d3.json('BLI.json')];

  Promise.all(requests).then(function(response) {
    var mapData = response[0]
    var otherData = response[1]

    createMap(mapData, otherData, svg, path, tip, color)

    }).catch(function(e){
        throw(e);
  });
};


function createMap(mapData, otherData, svg, path, tip, color) {

  // create list with satisfaction data for the world map
  var satisfactionById = {};

  for (element in otherData){
    satisfactionById[element] = +otherData[element]["Life satisfaction"];
  }
  mapData.features.forEach(function(d) { d.Value =satisfactionById[d.id] });

  // create the world map
  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(mapData.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) {
        return color(satisfactionById[d.id]);
      })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
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
        })
        .on('click', function(d){
          // remove previous graph
          d3.select("#graph > *").remove();

          // add new svg for a graph
          var graph = d3.select("#graph").append("svg")
                                   .attr("width", 200)
                                   .attr("height", 530);

          // create a graph with the country as title
          graph.append("text")
                .attr("id", "graphTitle")
                .attr("x", 100)
                .attr("y", 160)
                .attr("text-anchor", "middle")
                .text(d.properties.name)

          createGraph(otherData, d, graph)
        });

  svg.append("path")
      .datum(topojson.mesh(mapData.features, function(a, b) { return a.id !== b.id; }))
      .attr("class", "names")
      .attr("d", path);

  // append title
  svg.append("text")
     .attr("class", "title")
     .attr("x", 50)
     .attr("y", 30)
     .attr("id", "title")
     .text("Life Satisfaction");

   svg.append("text")
      .attr("class", "name")
      .attr("x", 50)
      .attr("y", 60)
      .text("Yang Yang To, 10340238");

    legend(svg)
  };

function legend(svg){
  // create a legend
  legendColor = colorList()

  var legend = svg.selectAll(".legend")
                  .data(legendColor)
                  .enter().append("g")
                  .attr("class", "legend")
                  .attr("transform", function(d, i) {return "translate(0," + i * 20 +")";});

  // add colored rectangles to the legend
  legend.append("rect")
        .attr("x", 30)
        .attr("y", 360)
        .style("fill", function(d){
          return d[1];
        })
        .attr('height', 20)
        .attr('width', 20)

  // add 'value names' to legend
  legend.append("text")
        .attr("x", 55)
        .attr("y", 370)
        .attr("dy", ".35em")
        .text(function(d){
          return d[0];
        });
};

function colorList(){
  // create the country list and a color list
  var score = ['<4','<5','<6','<7','>7', 'No data available']
  var colors = ['#bfd3e6', '#9ebcda', '#8c96c6', '#8856a7', '#810f7c', "black"]

  var legendData = [];

  // create a list with a list of country and color
  for (index in score){
    legendData.push([score[index], colors[index]]);
  };

  return legendData
};


function createGraph(otherData, d, graph){
  // if data is undefined, append text "data is not available"
  if (typeof (otherData[d.id]) == 'undefined'){
    graph.append("text")
          .attr("x", 100)
          .attr("y", 200)
          .attr("text-anchor", "middle")
          .style("font-size", "18px")
          .text("Data is not available")
  }

  // else, create graph
  else {
    // create a list with data for the graph
    var data = [];
    data.push({name: d.id, value: otherData[d.id]['Employment rate']},
              {name:d.id, value: otherData[d.id]['Educational attainment']},
              {name:d.id, value: otherData[d.id]['Water quality']},
              {name:d.id, value: otherData[d.id]['Quality of support network']});

    // define colors for the graph
    var colors = d3.scaleLinear()
                  .domain([0, 3])
                  .range(['#FCC90A', '#D50000']);

    // set tooltip
    var tooltip = d3.select("body").append("div")
                    .style('position','relative')
                    .style('background', "#d7d7d7")
                    .style('color', "#ffa500")
                    .style('border','1px #bdbdbd solid')
                    .style('opacity', '0.5')
                    .style('padding', "3px")
                    .style('border-radius','3px');

    // specify x, y and x-label scales
    var xScale =  d3.scaleBand()
      .domain(d3.range(0, 4))
      .range([15, 200])

    var yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, 200]);

    var labelScale =  d3.scaleBand()
                        .domain(["Employment Rate", "Educational Attainment",
                                 "Water Quality", "Quality of Support Network"])
                        .range([15, 193])

    // create barchart
    graph.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("width", 40)
            .attr("x",function(d,i) {
              return xScale(i); })
            .attr("y", function(d){
              return (400 - yScale(d.value))
            })
            .attr("fill", function(d,i) {
                return colors(i);
            })
            .attr("fill-opacity", 0.7)
            .attr("height", function(d){
              return yScale(d.value)
            })

            // create hover function
            .on('mousemove', function(d){
              tooltip.transition()
                .style('opacity', 1)
              tooltip.html("<strong>Percentage: </strong><span class='details'>"+ d.value + "<strong>%</strong><span class='details'>")
                .style('left', (d3.event.PageX) + 'px')
                .style('top', (d3.event.PageY + 'px'))
              d3.select(this).style('opacity', 0.8)
            })
            .on('mouseout', function(d){
              tooltip.transition()
                .style('opacity', 0)
              d3.select(this).style('opacity', 1)
            });

    // create x-axis label
    graph.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + 400 + ")")
          .call(d3.axisBottom(labelScale).ticks(4))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-63)");
  }
};
