// Name: Yang Yang To, Student Number: 10340238
// JavaScript file

var w = 800;
var h = 500;
var padding = 50
const startYear = 2007
const endYear = 2015

window.onload = function() {

  d3.select("head").append("title").text("Scatter Plot");
  d3.select("body").append("h3").text("Women in Science vs. Consumer Confidence");
  d3.select("body").append("p").text("Yang Yang To, 10340238");
  d3.select("body").append("p").text("Source: WEBSITE LINK HERE");

  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

  var requests = [d3.json(womenInScience), d3.json(consConf)];

  Promise.all(requests).then(function(response) {
      womenArray = transformResponse(response[0]);
      womenMinMax = calcMinMax(womenArray);

      consConfArray = transformResponse(response[1]);
      consMinMax = calcMinMax(consConfArray);

      var count = 0;
      consConfArray.forEach(function(element){
        console.log(womenArray[count].time)
        if (element.time == womenArray[count].time){
          element.datapoint2 = womenArray[count].datapoint;
          count++
        }
      });
      console.log(consConfArray);
      var x = xScale(0, Math.round(womenMinMax[1] + womenMinMax[0]));
      var y = yScale(consMinMax[0] - 5, consMinMax[1] + 5);

      //Create SVG element
      var svg = d3.select("body")
                  .append("svg")
                  .attr("width", w + padding)
                  .attr("height", h + padding);

      svg.selectAll("circle")
         .data(consConfArray)
         .enter()
         .append("circle")
         .attr("cx", function(d) {
              return x(d.datapoint2);
         })
         .attr("cy", function(d) {
              return h - padding - y(d.datapoint);
         })
         .attr("fill", function(d) {
           if (d.Country == "France"){
             return "#8dd3c7";
           }
           else if (d.Country == "Netherlands"){
             return '#bebada ';
           }
           else if (d.Country == "Portugal"){
             return '#ffffb3';
           }
           else if (d.Country == "Germany"){
             return '#fb8072';
           }
           else if (d.Country == "United Kingdom"){
             return '#80b1d3';
           }
           else{
             return '#fdb462';
           }
         })
         .attr("r", 5);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + ",450)")
        .call(d3.axisBottom(x));

      svg.append("g")
         .attr("class", "y axis")
         .attr("transform", "translate(" + padding + ",0)")
         .call(d3.axisLeft(y));

     svg.append("text")
         .attr("class", "y label")
         .attr("text-anchor", "end")
         .attr("y", 5)
         .attr("x", -140)
         .attr("dy", ".75em")
         .attr("transform", "rotate(-90)")
         .text("Consumer Confidence");

     svg.append("text")
         .attr("class", "x label")
         .attr("text-anchor", "end")
         .attr("x", 570)
         .attr("y", 500)
         .text("Percentage of Women in Science (%)");

     legend = svg.append("g")
         .attr("class","legend")
         .attr("transform","translate(50,30)")
         .style("font-size","12px")
         .call(d3.legend)

  }).catch(function(e){
      throw(e);
  });

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
  list = []
  array.forEach(function(element) {
    list.push(element.datapoint);
  });

  min = Math.min(...list);
  max = Math.max(...list);

  minMax = []
  minMax.push(min, max);

  return minMax
};

function xScale(minDomain, maxDomain){
  var xscale = d3.scaleLinear()
                  .domain([minDomain, maxDomain])
                  .range([padding, w]);
  return xscale
};

function yScale(minDomain, maxDomain){
  var yscale = d3.scaleLinear()
                  .domain([minDomain, maxDomain])
                  .range([h - padding, 0]);
  return yscale
};
