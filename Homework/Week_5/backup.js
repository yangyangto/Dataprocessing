// Name: Yang Yang To, Student Number: 10340238
// JavaScript file

var w = 800;
var h = 500;

window.onload = function() {

  d3.select("head").append("title").text("Scatter Plot");
  d3.select("body").append("h1").text("Women in Science");
  d3.select("body").append("p").text("Yang Yang To, 10340238");
  d3.select("body").append("p").text("Source: WEBSITE LINK HERE");

  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

  var requests = [d3.json(womenInScience), d3.json(consConf)];

  Promise.all(requests).then(function(response) {
      // doFunction(response);
      var dataList =[]
      var valueList = []
      dataArray = transformResponse(response);
      dataArray.forEach(function(element) {
        dataList.push([String(element.time), element.datapoint]);
        valueList.push(element.datapoint);
      });

      console.log(dataArray);
      var min = Math.min(...valueList);
      var max = Math.max(...valueList);
      console.log(min);
      console.log(max);

      var xScale = d3.scaleLinear()
                        .domain([2006, 2016])
                        .range([0, 800]);

      var yScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([0, 500]);

      //Create SVG element
      var svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);

      svg.selectAll("circle")
         .data(dataArray)
         .enter()
         .append("circle")
         .attr("cx", function(d) {
              return xScale(d.time);
         })
         .attr("cy", function(d) {
              return yScale(d.datapoint);
         })
         .attr("r", 5);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + ",450)")
        .call(d3.axisBottom(xScale));


  }).catch(function(e){
      throw(e);
  });

};


function transformResponse(data){

  // access data property of the response
  for (let i = 0; i < data.length; i++) {
    let dataHere = data[i].dataSets[0].series;

    // access variables in the response and save length for later
    let series = data[i].structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data[i].structure.dimensions.observation[0];

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
};
