// Name: Yang Yang To, Student Number: 10340238
// JavaScript file

var w = 800;
var h = 500;
var padding = 50

window.onload = function() {
  // add text/titles
  addText();

  // define data
  var womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

  var requests = [d3.json(womenInScience), d3.json(consConf)];

  // create scatterplot with interactivity
  Promise.all(requests).then(function(response) {
      // transform data to certain dataformat and calculate minimum and maximum value
      womenArray = transformResponse(response[0]);
      womenMinMax = calcMinMax(womenArray);

      consConfArray = transformResponse(response[1]);
      consMinMax = calcMinMax(consConfArray);

      // append datapoints from women in science dataset to the consumer confidence dataset
      var count = 0;
      consConfArray.forEach(function(element){
        if (element.time == womenArray[count].time){
          element.datapoint2 = womenArray[count].datapoint;
          count++
        }
      });

      // create x and y transformations
      var x = xScale(0, Math.round(womenMinMax[1] + womenMinMax[0]));
      var y = yScale(consMinMax[0] - 5, consMinMax[1] + 5);

      // create a dictionary with country linked to a specific color
      legendData = colorList()

      //Create SVG element and draw a graph with a dropdown menu
      svg = makeSvg()
      drawGraph(svg, consConfArray, x, y);
      dropdown(svg, consConfArray, x, y)

  }).catch(function(e){
      throw(e);
  });

};

function addText(){
  d3.select("head").append("title").text("Scatter Plot");
  d3.select("body").append("h3").text("Scatterplot: Women in Science vs. Consumer Confidence");
  d3.select("body").append("h4").text("Yang Yang To, 10340238");
  d3.select("body").append("p").text("An interactive scatterplot of Percentage of Women in Science and Consumer Confidence from 2007 till 2015.");
  d3.select("body").append("p").text("Data Source Women in Science")
    .on("click", function() { window.open("https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"); })
    .attr("id", "datawomen");
  d3.select("body").append("p").text("Data Source Consumer Confidence")
    .on("click", function() { window.open("https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"); })
    .attr("id", "dataconsumer");
};

function transformResponse(data){
  // access data property of the response
  let dataHere = data.dataSets[0].series;

  // access variables in the response and save length for later
  let series = data.structure.dimensions.series;
  let seriesLength = series.length;

  // set up array of variables and array of lengths
  let varArray = [];
  let lenArray = [];

  series.forEach(function(serie){
      varArray.push(serie);
      lenArray.push(serie.values.length);
  });

  // get the time periods in the dataset
  let observation = data.structure.dimensions.observation[0];

  // add time periods to the variables, but since it's not included in the
  // 0:0:0 format it's not included in the array of lengths
  varArray.push(observation);

  // create array with all possible combinations of the 0:0:0 format
  let strings = Object.keys(dataHere);

  // set up output array, an array of objects, each containing a single datapoint
  // and the descriptors for that datapoint
  let dataArray = [];

  // for each string that we created
  strings.forEach(function(string){
      // for each observation and its index
      observation.values.forEach(function(obs, index){
          let data = dataHere[string].observations[index];
          if (data != undefined){

              // set up temporary object
              let tempObj = {};

              let tempString = string.split(":").slice(0, -1);
              tempString.forEach(function(s, indexi){
                  tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
              });

              // every datapoint has a time and ofcourse a datapoint
              tempObj["time"] = obs.name;
              tempObj["datapoint"] = data[0];
              dataArray.push(tempObj);
          }
      });
  });

  // return the finished product!
  return dataArray;
};

function calcMinMax(array){
  // create a list with all the datapoints
  list = []
  array.forEach(function(element) {
    list.push(element.datapoint);
  });

  // calculate the minimum and maximum value and append to the minMax list
  min = Math.min(...list);
  max = Math.max(...list);

  minMax = []
  minMax.push(min, max);
  console.log(minMax);

  return minMax
};

function xScale(minDomain, maxDomain){
  // create the xscale transformation
  var xscale = d3.scaleLinear()
                  .domain([minDomain, maxDomain])
                  .range([padding, w]);
  return xscale
};

function yScale(minDomain, maxDomain){
  // create the yscale transformation
  var yscale = d3.scaleLinear()
                  .domain([minDomain, maxDomain])
                  .range([h, 0 + padding]);
  return yscale
};

function makeSvg(){
  // create an svg
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w + padding)
              .attr("height", h + padding)
              .attr("id", "svgPlot");
  return svg
}

function legend(svg){
  // create a legend
  legendData = colorList()

  var legend = svg.selectAll(".legend")
                  .data(legendData)
                  .enter().append("g")
                  .attr("class", "legend")
                  .attr("transform", function(d, i) {return "translate(0," + i * 20 +")";});

  // add colored circles to the legend
  legend.append("circle")
        .attr("cx", w - 80)
        .attr("cy", 370)
        .attr("r", 5)
        .style("fill", function(d){
          return d[1];
        });

  // add country names to the legend
  legend.append("text")
        .attr("x", w - 70)
        .attr("y", 370)
        .attr("dy", ".35em")
        .text(function(d){
          return d[0];
        });
};

function dropdown(svg, data){
  // create a dropdown menu with years as options
  var yearList= ["All", "2007", '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'];
  var year = d3.select("body")

  year.append("select")
	    .selectAll("option")
        .data(yearList)
        .enter()
        .append("option")
        .attr("cx", 0)
        .attr("cy", 0)
        .text(function(d){
            return d;
        });

  // define the selected year when clicked on an option
  year.on('change', function(){
    var selectedYear = d3.select(this)
            .select("select")
            .property("value")

    // remove all circles and legend
    svg.selectAll("circle").remove();
    svg.selectAll(".legend").remove();

    // create new data set with filtered data
    var filtered = data.filter(function(d){
                  if (selectedYear == "All") {
                    return data;
                  }
                  return d.time == selectedYear;
                })

    // create a new graph with new
    updatePlot(svg, filtered, selectedYear)
  });

};

function updatePlot(svg, data, year){
  // update the scatterplot with filtered data
  legendData = colorList()

  var x = xScale(0, Math.round(womenMinMax[1] + womenMinMax[0]));
  var y = yScale(consMinMax[0] - 5, consMinMax[1] + 5);

  drawGraph(svg, data, x, y);
};

function colorList(){
  // create the country list and a color list
  var country = ["France", "Netherlands", "Portugal", "Germany", "United Kingdom", "Korea"];
  var colors = ["#8dd3c7", '#bebada', '#ffd92f','#fb8072', '#80b1d3', '#fdb462'];

  var legendData = [];

  // create a list with a list of country and color
  for (index in country){
    legendData.push([country[index], colors[index]]);
  };

  return legendData
}

function drawGraph(svg, data, x, y){
  svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
       if (typeof d.datapoint2 === 'undefined') {
            return - 10
        }
       else{
         return x(d.datapoint2);
       }
     })
     .attr("cy", function(d) {
          return h + padding - y(d.datapoint);
     })
     .attr("fill", function(d) {
       if (d.Country == legendData[0][0]){
         return legendData[0][1];
       }
       else if (d.Country == legendData[1][0]){
         return legendData[1][1];
       }
       else if (d.Country == legendData[2][0]){
         return legendData[2][1];
       }
       else if (d.Country == legendData[3][0]){
         return legendData[3][1];
       }
       else if (d.Country == legendData[4][0]){
         return legendData[4][1];
       }
       else{
         return legendData[5][1];
       }
     })
     .attr("r", 6);

     graphLabels(svg, x, y);
     legend(svg);
};

function graphLabels(svg, x, y){
  // add the x axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + ",500)")
    .call(d3.axisBottom(x));

  // add y axis
  svg.append("g")
     .attr("class", "y axis")
     .attr("transform", "translate(" + padding + ",0)")
     .call(d3.axisLeft(y));

  // add y label
  svg.append("text")
     .attr("class", "y label")
     .attr("text-anchor", "end")
     .attr("y", 5)
     .attr("x", -180)
     .attr("dy", ".75em")
     .attr("transform", "rotate(-90)")
     .text("Consumer Confidence");

  // add x label
  svg.append("text")
     .attr("class", "x label")
     .attr("text-anchor", "end")
     .attr("x", 570)
     .attr("y", 540)
     .text("Percentage of Women in Science (%)");

  svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "middle")
  .attr("x", 430)
  .attr("y", 35)
  .style("font-size", "20px")
  .text("Scatterplot Women in Science & Consumer Confidence");
};
