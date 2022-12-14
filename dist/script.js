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

function sepSeconds(time) {
  let seconds = Number(time.substring(3));
  return seconds;
}
function sepMinutes(time) {
  let minutes = Number(time.substring(0,2));
  return minutes;
}
console.log(sepMinutes('37:15'));
console.log(new Date(1999,1,1,0,sepMinutes('37:30'),sepSeconds('37:30')));

fetch(
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").

then(response => response.json()).
then(data => {
 
  let dataset = data.map(item => [
  item.Year,
  item.Time,
  1000 * (item.Seconds), 
  item.Name,
  item.Nationality,
  item.Doping, 
  new Date(1999,1,1,0,sepMinutes(item.Time),sepSeconds(item.Time))
]);
 
  const svg = d3.
  select("#chart").
  append("svg").
  attr("width", w + leftMargin + rightMargin).
  attr("height", h + topMargin + bottomMargin);

  svg.append('text').text('Time in minutes').attr('transform','rotate(-90)').attr('x',-330).attr('y',20);
  svg.append('text').text('Year').attr('x',w/2).attr('y',h+30);

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


  // legend 
let legendContainer = svg.append('g').attr("id", "legend")
.attr('transform','translate(800,200)');

legendContainer
.selectAll('.none').data([goodColor,badColor])
.enter().append('circle')
.attr('cx',0).attr('cy',(d,i)=>20*i).attr('r',7)
.attr('fill',d=>d).attr('stroke','black')
.style('opacity','0.9');

legendContainer.selectAll('.none').data([goodColor,badColor])
.enter().append('text').text((d,i)=>i==0?'No Doping Allegations':'Riders with Doping Allegations')
.attr('x',0).attr('y',(d,i)=>20*i)
.attr('dx',15).attr('dy',5);

legendContainer.append('rect').attr('width',280).attr('height',50)
.attr('fill','transparent')
.attr('stroke','black')
.attr('x',-18).attr('y',-17);



  const yScale = d3.scaleTime();
  let minY = new Date(d3.min(dataset, d => d[2]));
  let maxY = new Date(d3.max(dataset, d => d[2]));
 
  yScale.domain(d3.extent(dataset,d=>d[6]));

  yScale.range([topMargin, h]);

  const yAxis = d3.axisLeft(yScale);
  yAxis.tickFormat(d3.timeFormat("%M:%S"));
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

  let dotColor = d3.scaleOrdinal([goodColor,badColor]);

  let circles = svg.
  selectAll("circle").
  data(dataset).
  enter().
  append("circle").
  attr("class", "dot").
  style('opacity','0.9').
  attr("data-xvalue", d => d[0]).
  attr("data-yvalue", d => d[6]).
  attr('fill',d=>dotColor(d[5] === "")).
  attr("cx", d => xScale(d[0])).
  attr("cy", d => yScale(d[6])).
  attr("r", 7).
  
  attr("stroke", "black").
  attr("stroke-width", 1).
  on("mouseover", function (event, d) {

    tooltip.
    style("opacity", "0.9").
    style('left', event.clientX + 10 + 'px').style('top', event.clientY - 20 + 'px')
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

  
})
.catch((error)=>{console.log(error,"hello")});