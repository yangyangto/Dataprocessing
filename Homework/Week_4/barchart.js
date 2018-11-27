// Name: Yang Yang To, Student number:10340238
// This file will plot a bar chart with JavaScript.

// globally defining variables
var width_svg = 900;
var height_svg = 2900;
var height_bar = 15;
var padding = 3;

// data lists
var countrylist= [];
var happinesslist=[];

// Header text
d3.select("head").append("title").text("D3 Bar Chart Happiness");
d3.select("body").append("h1").text("World Happiness Report");
d3.select("body").append("p").text("Yang Yang To, 10340238");
d3.select("body").append("h3").text("Short Description of the bar chart");
d3.select("body").append("p").text("A bar chart showing the Happiness Score per Country in 2017. Source: Kaggle");
d3.select("body").append("p").text("Score:");

// parse in data from csv and fill in datalists
d3.csv('Happiness2017.csv').then(function(data) {
  for (const row in data) {
    country = data[row]['Country'];
    countrylist.push(country);
    score = Number(data[row]['Happiness.Score']);
    score = Math.round(score * 100) / 100
    happinesslist.push(score);
  }

  // remove non valid data
  happinesslist = happinesslist.filter(Boolean);
  countrylist = countrylist.filter(Boolean);

  // define the scale in order to map the input values in certain output range
  var scale = d3.scaleLinear()
                    .domain([0, 10])
                    .range([0, 780]);

  // create the tooltip (for when you hover over the bars)
  var tooltip = d3.select('body').append('div')
      .style('position', 'fixed')
      .style('background', 'white')
      .style('padding', '5 25 px')
      .style('border-radius','5px')
      .style('opacity', '0');
      // .append("text").text("hi");

  // create an svg ("canvas")
  var svg = d3.select("body")
              .append("svg")
              .attr("width", width_svg)
              .attr("height", height_svg);

  // create rectangles as bars
  var rect = svg.selectAll('rect')
              .data(happinesslist)
              .enter().append('rect')
              .style('fill', 'lightseagreen')
                .attr('height', height_bar)
                .attr('width', function(d){
                  return scale(d);
                })
                .attr('y', function(d, i){
                  return i * (height_bar + padding);
                })
                .attr('x', 50)
              // create a hover function
              .on('mousemove', function(d){
                tooltip.transition()
                  .style('opacity', 1)
                tooltip.html(d)
                  .style('left', (d3.event.PageX) + 'px')
                  .style('top', (d3.event.PageY + 'px'))
                d3.select(this).style('opacity', 0.5)
              })
              .on('mouseout', function(d){
                tooltip.transition()
                  .style('opacity', 0)
                d3.select(this).style('opacity', 1)
              });

  // put the name of the country in each bar
  svg.selectAll('text')
        .data(countrylist)
        .enter().append('text')
          .attr("text-anchor", "start")
          .attr("x", function(d){
            return 60;
          })
          .attr("y", function(d, i){
            return (i * (height_bar + padding)) + 13;
          })
          .text(function(d){
            return d;
          });

  // create an x-axis
  svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(" + 50 + ",2800)")
     .call(d3.axisBottom(scale));

  // create y and x labels
  svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 9)
      .attr("x", -1300)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Country");

  svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", 550)
      .attr("y", 2850)
      .text("Happness Score (1 - 10)");
});
