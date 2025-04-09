/*
*    main.js
*/


var svg = d3.select("#chart-area").append("svg").attr("width", 600).attr("height", 400);
var margin = {left: 100, right: 10, top: 10, bottom: 100};
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var xKey = " Total items";
var yKey = " Avg. Fixing time";
var areaKey = " Avg. Production Time WS";

var x = d3.scaleLog().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var area = d3.scaleLinear().range([0 * Math.PI, 15 * Math.PI])

var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
	.attr("width", width).attr("height", height);

var bottomAxis = d3.axisBottom(x);
var leftAxis = d3.axisLeft(y);

var bottomAxisGroup = g.append("g")
	.attr("class", "bottom axis")
	.attr("transform", "translate(0, " + height + ")")
var leftAxisGroup = g.append("g")
	.attr("class", "left axis")
	.attr("height", height)

var t = d3.transition(1)

var day = 0;

d3.csv("simulator/output.csv", d => {
	return {
		...d,
		" Total items": +d[" Total items"],
		" Avg. Fixing time": +d[" Avg. Fixing time"],
		" Avg. Production Time WS": +d[" Avg. Production Time WS"],
		" Day": +d[" Day"]
	};
}).then(function(data){
	$("#date-slider").slider({
		max: 100, min: 1, step: 1,		// Options
		slide:(event, ui) => {			// Events
			day = ui.value;
			update(data);
		}
	});
})

function update(data){

	$("#date-slider").slider("value", +(day))
	$("#year")[0].innerHTML = +(day)

	x.domain(d3.extent(data, d => d[xKey]));
	y.domain(d3.extent(data, d => d[yKey]));
	area.domain(d3.extent(data, d => d[areaKey]));

	data = data.filter((d) => {
		return d[" Day"] == day;
	});

	console.log(data);

	var color = d3.scaleOrdinal()
		.domain(data.map(d => d[areaKey]))
		.range(d3.schemePastel1);

	var circles = g.selectAll("circle").data(data);

	circles.exit().remove();

	circles.transition(t)
		.attr("cx", d => x(d[xKey]))
		.attr("cy", d => y(d[yKey]))
		.attr("r", (d) => { return d[areaKey]; })
		.attr("fill", d => color(d[" Day"]));

	circles.enter().append("circle")
		.attr("cx", d => x(d[xKey]))
		.attr("cy", d => y(d[yKey]))
		.attr("r", (d) => { return d[areaKey]; })
		.attr("fill", d => color(d[" Day"]));


	bottomAxisGroup.transition(t).call(bottomAxis)
		.selectAll("text")
		.attr("x", -5)
		.attr("y", 10)
		.attr("text-anchor", "end")
		.attr("transform", "rotate(-40)")
		.attr("font-size", "12px");

	leftAxisGroup.transition(t).call(leftAxis);
}

g.append("text")
	.attr("x", width / 2)
	.attr("y", height + 90)
	.attr("text-anchor", "middle")
	.attr("font-size", "20px")
	.text("Total items");

g.append("text")
	.attr("x", -(height) / 2)
	.attr("y", -60)
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.attr("font-size", "20px")
	.text("Average Fixing Time");
