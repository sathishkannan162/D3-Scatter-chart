const w = 1000,
h = 620;
const padding = 30;
const topMargin = 30,
bottomMargin = 30,
rightMargin = 20,
leftMargin = 60;
const badColor = "#28b3f4";
const goodColor = "orange";

let tooltip = d3.
select("#container").
append("div").
attr("id", "tooltip").
style("opacity", "0");

// console.log(inSeconds("02:30"));

fetch(
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").

then(response => response.json()).
then(data => {
  // console.log(data);
  // console.log(JSON.stringify(data));
  // data.map(item=>{console.log(item)});
  // data.map((item) => {
  //   console.log(item.Year, item.Time);
  // });
  // console.log("before svg");

  // let newDataset = data.map(
  //   (item) => new Date(null, null, null, null, null, item.Seconds)
  // );
  // console.log(newDataset);
  // console.log(
  //   newDataset[0].toISOString().replace("Z", " ").split(".")[0],
  //   "hello"
  // );
  // let newDate =       newDataset[0].toISOString().replace("Z", " ").split(".")[0];
  // console.log(newDate);
  //  let extraDate = new Date(newDate);
  //  console.log(extraDate);

  // console.log(newDateset[0].toISOString(),"hello");

  let dataset = data.map(item => [
  item.Year,
  item.Time,
  1000 * (item.Seconds + 30 * 60), // added 3 minutes to account for time zone.
  item.Name,
  item.Nationality,
  item.Doping, new Date(1000 * (item.Seconds + 30 * 60))]);
  //secondsis in milliseconds
  console.log(dataset);

  //   console.log(d3.min(dataset, d=>d[2]));
  //   console.log(d3.max(dataset, d=>d[2]));
  //   console.log(yScale(2390*1000));
  // console.log(yAxis(2390));

  // console.log(yAxis);
  // svg.append("text").text("hello");

  //add y-axis
  // svg.append('g').attr('id','y-axis').call(yAxis);

  const svg = d3.
  select("#chart").
  append("svg").
  attr("width", w + leftMargin + rightMargin).
  attr("height", h + topMargin + bottomMargin);

  svg.append('text').text('Time in minutes').attr('transform','rotate(-90)').attr('x',-330).attr('y',20);
  svg.append('text').text('Year').attr('x',w/2).attr('y',h+30)

  svg.
  append("text").
  attr("id", "title").
  text("Doping in Professional Bicycle Racing").
  attr("x", (w + leftMargin + rightMargin - 440) / 2).
  attr("y", 50).
  style("font-size", 30);

  svg.
  append("text").
  attr("id", "sub-line").
  text("35 Fastest times up Alpe d'Huez").
  attr("x", (w + leftMargin + rightMargin - 200) / 2).
  attr("y", 75).
  style("font-size", 20);

  //legend

  svg.
  append("circle").
  attr("fill", goodColor).
  attr("id", "legend").
  attr("cx", 800).
  attr("cy", 400).
  attr("r", 7).
  attr("stroke", "black").
  attr("stroke-width", 2);

  svg.
  append("circle").
  attr("fill", badColor).
  attr("cx", 800).
  attr("cy", 420).
  attr("r", 7).
  attr("stroke", "black").
  attr("stroke-width", 2);

  svg.
  append("text").
  text("No doping allegations").
  attr("x", 815).
  attr("y", 405).
  attr("font-size", 15);

  svg.
  append("text").
  text("Riders with doping allegations").
  attr("x", 815).
  attr("y", 427);

  // .append('text').attr('id','sub-line').text("35 Fastest times up Alpe d'Huez");
  // console.log("after svg");
  // const yScale = d3.scaleTime();
  const yScale = d3.scaleUtc();
  // let minY = new Date(Date.UTC(0,0,0,0,0,0,d3.min(dataset, (d) => d[2])));
  let minY = new Date(d3.min(dataset, d => d[2]));
  // let maxY = new Date(Date.UTC(0,0,0,0,0,0,d3.max(dataset, (d) => d[2])));
  let maxY = new Date(d3.max(dataset, d => d[2]));
  console.log(minY.toString());
  console.log(maxY);
  // console.log(minY.toString())
  // console.log(Date.UTC(0,0,0,0,0,0,2390000),'utc')
  yScale.domain([minY, maxY]);
  // yScale.domain([minY, maxY]);

  yScale.range([topMargin, h]);

  const yAxis = d3.axisLeft(yScale);
  yAxis.tickFormat(d3.timeFormat("%M:%S"));
  // yAxis.tickFormat(d3.format(''));
  svg.
  append("g").
  attr("id", "y-axis").
  attr("transform", "translate(" + leftMargin + ",0)").
  call(yAxis);

  const xScale = d3.
  scaleLinear().
  domain([
  d3.min(dataset, d => d[0]) - 1,
  d3.max(dataset, d => d[0]) + 1]).

  range([leftMargin, w]);
  const xAxis = d3.axisBottom(xScale);
  xAxis.tickFormat(d3.format(""));
  svg.
  append("g").
  attr("id", "x-axis").
  attr("transform", "translate(0," + h + ")").
  call(xAxis);
  // console.log(xScale(1994),"hello");

  let bars = svg.
  selectAll("circle").
  data(dataset).
  enter().
  append("circle").
  attr("class", "dot").
  attr("data-xvalue", d => d[0]).
  attr("data-yvalue", d => d[6]).
  attr("fill", d => d[5] === "" ? goodColor : badColor).
  attr("cx", d => xScale(d[0])).
  attr("cy", d => yScale(d[2])).
  attr("r", 7).
  attr("stroke", "black").
  attr("stroke-width", 2).
  on("mouseover", function (event, d) {
    // console.log("mouseover");
    // console.log(event.clientX,event.clientY)

    tooltip.
    style("opacity", "0.9").
    style('left', event.clientX + 10 + 'px').style('top', event.clientY - 20 + 'px')
    // .style("left", xScale(d[0]) + 30 + "px")
    // .style("top", yScale(d[2]) - 5 + "px")
    .html(
    d[3] +
    ": " +
    d[4] +
    "<br/>" +
    "Year: " +
    d[0] +
    ", Time: " +
    d[1] + (
    d[5] === "" ? "" : "<br/><br/>") +
    d[5]).

    attr("data-year", d[0]);
  }).
  on("mouseout", function (event, d) {
    tooltip.style("opacity", "0");
  });
  // svg.append('rect').attr("height",40).attr("width",40).attr("fill","navy");
});