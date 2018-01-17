/*
Casper van Velzen
11030275
Minor Programmeren / Final Project
Shows statistics on Landorus-Therian and the metagame in VGC 2015
*/

window.onload = function() {
	// load all datasets
	d3.queue()
	.defer(d3.json, "data/Lando_data_0.json")
	.defer(d3.json, "data/Lando_data_1500.json")
	.defer(d3.json, "data/Lando_data_1630.json")
	.defer(d3.json, "data/Lando_data_1760.json")
	.defer(d3.json, "data/meta_data_0.json")
	// .defer(d3.json, "data/meta_data_1500.json")
	// .defer(d3.json, "data/meta_data_1630.json")
	// .defer(d3.json, "data/meta_data_1760.json")
	.await(dataLoaded); 

	};

function dataLoaded(error, lando0, lando1500, lando1630, lando1760, meta0) {
	if (error) throw error;
	lineGraph(lando1500);
	pieChart(lando1500[0]);
	// barChart(meta0[0])
	};

// TODO: make it actually work
function lineGraph(data) {
	// remove previous line
	d3.selectAll(".lineg")
		.remove();

	/*
	Bug: svg.attr is "100%" due to being variable thanks to bootstrap
	this means width == NaN, making it incompatible with d3 functions
	Solution: dimensions of bounding box?!?
	LITERALLY DON"T EVEN TRY TO SOLVE THIS BS
	*/
	var svg = d3.select("#linesvg"),
	margin = {top: 30, right: 30, bottom: 30, left: 30},
    bbox = linesvg.width.animVal.value,
    width = bbox - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("class", "lineg").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleLinear()
		.domain(function(d) { return d.month; })
		.rangeRound([0, width]);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	x.domain(d3.extent(data, function(d) { return d.month; }));
    y.domain([15, 65]);

	var line = d3.line()
	.x(function(d) { return x(d.month); })
	.y(function(d) { return y(d.usage_stats.usage); });

    g.append("g")
    	.attr("transform", "translate(0," + height + ")")
    	.call(d3.axisBottom(x)
    	.ticks(12)	
    	.tickFormat(function(d) { return d; }));

	// create y axis
	g.append("g")
		.call(d3.axisLeft(y))
	.append("text")
		.attr("fill", "#000")
		.attr("font-size", 12)
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("usage (%)");

	// create line
	d3.selectAll(".lineg")
		.append("path")
		.data([data])
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("stroke-width", 1.5 )
			.attr("d", line);
}


// TODO: make it work/ disable asynchronosity somehow/ look up how to spell that word
function pieChart(data) {
	// clear pie chart
	d3.selectAll(".pieg")
		.remove();
	
	var svg = d3.select("#piesvg1"),
    width = 350,
    height = 350,
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("class", "pieg").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var color = d3.scaleOrdinal(["#BF360C", "#D84315", "#E64A19", "#F4511E", "#FF5722", "#FF7043", "#FF8A65", "#FFAB91", "#FFCCBC"]);

	var pie = d3.pie()
	    .sort(null)
	    .value(function(d) { return data['moves'][d]; });

	var path = d3.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

	var label = d3.arc()
	    .outerRadius(radius - 40)
	    .innerRadius(radius - 40);

	console.log(path);

	var arc = g.selectAll(".arc")
		.data(pie(Object.keys(data['moves'])))
		.enter().append("g")
	    	.attr("class", "arc");

	arc.append("path")
	    .attr("d", path)
	    .attr("fill", function(d, i) { return color(i); });

	arc.append("text")
		.attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
		.attr("dy", "0.35em")
		.text(function(d, i) { var move = Object.keys(data['moves']); return move[i]; });
}


// TODO: make this work
function barChart(data) {
	// count most common types
	var typedata = countTypes(data),
	typelist = ["bug", "dark", "dragon", "electric", "fairy", "fighting", "fire",
				"flying", "ghost", "grass", "ground", "ice", "normal", "poison", 
				"psychic", "rock", "steel", "water"];
	console.log(typedata);
	console.log(typelist);

	var svg = d3.select("#barsvg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	    y = d3.scaleLinear().rangeRound([height, 0]);

	var g = svg.append("g")
		.attr("class", "barg")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// // Bostock data, remove when done with bar
	// d3.tsv("data.tsv", function(d) {
	//   d.frequency = +d.frequency;
	//   return d;
	// }, function(error, data) {
	//   if (error) throw error;

	x.domain(typelist.map(function(d) { return d; }));
	y.domain([0, 6]);

	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	g.append("g")
		.attr("class", "axis axis--y")
	.call(d3.axisLeft(y).ticks(6))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Frequency");

	g.selectAll(".bar")
		.data(typedata)
	.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { console.log('hoi'); return x(d); })
		.attr("y", function(d) { return y(d.frequency); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d.frequency); });

}

// TODO: add dropdown menu
function dropdown() { console.log("Hi I am a dropdown menu function, but I currently do not work :/")};

function countTypes(data) {
	var typedata = {"bug": 0, "dark": 0, "dragon": 0, "electric": 0, "fairy": 0, "fighting": 0, "fire": 0,
					"flying": 0, "ghost": 0, "grass": 0, "ground": 0, "ice": 0, "normal": 0, "poison": 0, 
					"psychic": 0, "rock": 0, "steel": 0, "water": 0};

	for (var key in data) {
		typedata[data[key].type1] += 1;
		if (data[key].type2 != "none") {
			typedata[data[key].type2] += 1;
		}
	}

	return typedata
}