/*
Casper van Velzen
11030275
Minor Programmeren / Final Project
Creates visualisations about the usage of Landorus-Therian in VGC 2015 and the metagame at that time.
*/

// global variables
var tip, currentWeight, selectedMonth, lando0, lando1500, lando1630, lando1760, meta0, meta1500, meta1630, meta1760;
var monthList = ["Januari", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/*
Loads all datasets.
*/
window.onload = function() {
	// load all datasets
	d3.queue()
	.defer(d3.json, "data/Lando_data_0.json")
	.defer(d3.json, "data/Lando_data_1500.json")
	.defer(d3.json, "data/Lando_data_1630.json")
	.defer(d3.json, "data/Lando_data_1760.json")
	.defer(d3.json, "data/meta_data_0.json")
	.defer(d3.json, "data/meta_data_1500.json")
	.defer(d3.json, "data/meta_data_1630.json")
	.defer(d3.json, "data/meta_data_1760.json")
	.await(dataLoaded);
};

/*
Assigns loaded data to global variables.
Initialises settings for selected month and ranking weight.
Loads all graphs.
Intialises functions for interactive elements.
*/
function dataLoaded(error, landoData0, landoData1500, landoData1630, landoData1760, metaData0, metaData1500, metaData1630, metaData1760) {
	if (error) throw error;

	// assign data to globals
	selectedMonth = 0;
	currentWeight = "0";
	lando0 = landoData0;
	lando1500 = landoData1500;
	lando1630 = landoData1630;
	lando1760 = landoData1760;
	meta0 = metaData0;
	meta1500 = metaData1500;
	meta1630 = metaData1630;
	meta1760 = metaData1760;

	// initial creation of all graphs
	loadCharts(currentWeight, selectedMonth);

	// call functions for interactive elements
	dropdown();
	slider();
	tip();
};

/*
Reads currently selected ranking weight and month.
Then calls functions to create all graphs passing the correct arguments.
*/
function loadCharts(weight, selectedMonth) {
	// update graphs using correct ranking weight and month
	switch (weight) {
	case "0":
		lineGraph(lando0);
		pieChart(lando0[selectedMonth], 1, "moves");
		pieChart(lando0[selectedMonth], 2, "items");
		barChart(meta0[selectedMonth]);
		usageTable(meta0[selectedMonth], ["mon", "usage"]);
		break;
	case "1500":
		lineGraph(lando1500);
		pieChart(lando1500[selectedMonth], 1, "moves");
		pieChart(lando1500[selectedMonth], 2, "items");
		barChart(meta1500[selectedMonth]);
		usageTable(meta1500[selectedMonth], ["mon", "usage"]);
		break;
	case "1630":
		lineGraph(lando1630);
		pieChart(lando1630[selectedMonth], 1, "moves");
		pieChart(lando1630[selectedMonth], 2, "items");
		barChart(meta1630[selectedMonth]);
		usageTable(meta1630[selectedMonth], ["mon", "usage"]);
		break;
	case "1760":
		lineGraph(lando1760);
		pieChart(lando1760[selectedMonth], 1, "moves");
		pieChart(lando1760[selectedMonth], 2, "items");
		barChart(meta1760[selectedMonth]);
		usageTable(meta1760[selectedMonth], ["mon", "usage"]);
		break;
	}
};

/*
Creates a line chart using usage percentage for Landorus-Therian.
*/
function lineGraph(data) {
	// remove previous line
	d3.selectAll(".lineg")
		.remove();

	// dimensions of the line graph
	var svg = d3.select("#linesvg"),
	margin = {top: 30, right: 30, bottom: 30, left: 30},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("class", "lineg").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// create x axis
	var x = d3.scaleLinear()
		.domain(function(d) { return d.month; })
		.rangeRound([0, width]);

	x.domain(d3.extent(data, function(d) { return d.month; }));

	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x)
		.ticks(12)	
		.tickFormat(function(d, i) { return monthList[i]; }));

	// create y axis
	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	y.domain([15, 65]);
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

	// function to create line
	var line = d3.line()
	.x(function(d) { return x(d.month); })
	.y(function(d) { return y(d.usage_stats.usage); });

	// draw line
	d3.selectAll(".lineg")
		.append("path")
		.data([data])
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("stroke-width", 1.5 )
			.attr("d", line);
};

/*
Creates one pie chart.
Selects either moves or items during the selected month.
*/
function pieChart(data, chartNr, chartType) {
	// clear pie chart
	d3.selectAll(".pieg" + chartNr)
		.remove();
	
	// dimensions of the line graph
	var svg = d3.select("#piesvg" + chartNr),
	width = 350,
	height = 350,
	radius = Math.min(width, height) / 2,
	g = svg.append("g").attr("class", "pieg" + chartNr).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	// pick color scheme
	if (chartType == "moves") {
		var color = d3.scaleOrdinal(["#BF360C", "#D84315", "#E64A19", "#F4511E", "#FF5722", "#FF7043", "#FF8A65", "#FFAB91", "#FFCCBC"]);
	}
	else {
		var color = d3.scaleOrdinal(["#0D47A1", "#1565C0", "#1976D2", "#1E88E5", "#2196F3", "#42A5F5", "#64B5F6", "#90CAF9", "#BBDEFB"]);
	}

	// calculate size of pie slices
	var pie = d3.pie()
		.sort(null)
		.value(function(d) { return data[chartType][d]; });

	// calculate path of pie slices
	var path = d3.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	// add correct number of slices
	var arc = g.selectAll(".arc")
		.data(pie(Object.keys(data[chartType])))
		.enter().append("g")
			.attr("class", "arc");

	// draw pie
	arc.append("path")
		.attr("d", path)
		.attr("fill", function(d, i) { return color(i); })
		.attr("class", function(d) { return (d.data + chartNr).replace(" ", "_"); })
		.on("mouseover", function(d) {
			tip.transition()
				.duration(200)
				.style("opacity", 1);
			tip.html(d.data + "<br/>" + d.value + "%")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
			var currClass = d3.select(this).attr("class");
			d3.selectAll("." + currClass).style("opacity", 0.55);
		})
		// make tooltip follow mouse
		.on("mousemove", function(d) {
			tip.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			tip.transition()
				.duration(500)
				.style("opacity", 0);
			var currClass = d3.select(this).attr("class");
			d3.selectAll("." + currClass).style("opacity", 1);
		});

	// create table displaying data
	pieTable(data[chartType], [chartType, "usage"], chartNr, chartType);
};

/*
Creates tables under the pie charts.
Uses the same data as pieChart.
*/
function pieTable(data, columns, chartNr, chartType) {
	// clear current table
	d3.selectAll(".pieTable" + chartNr)
		.remove();

	// extract data from dataset
	var pieData = [],
	index = 0;
	for (var key in data) {
		if (chartType == "moves") {
			pieData[index] = {moves: key, usage: data[key]};
		}
		else {
			pieData[index] = {items: key, usage: data[key]};
		};
		index += 1;
	};

	// initiate table elements
	var table = d3.select("#pietablediv" + chartNr).append("table").attr("class", "pieTable" + chartNr),
	thead = table.append("thead"),
	tbody = table.append("tbody");

	// draw table head
	thead.append("tr")
		.selectAll("th")
		.data(columns).enter()
		.append("th")
			.text(function (column) { return capitalize(column); });

	// draw table rows
	var rows = tbody.selectAll("tr")
		.data(pieData)
		.enter()
		.append("tr")
		.attr("class", function(d, i) { return (d[chartType] + chartNr).replace(" ", "_"); })
		.on("mouseover", function(d) {
			var currClass = d3.select(this).attr("class");
			d3.selectAll("." + currClass).style("opacity", 0.55) })
		.on("mouseout", function(d) {
			var currClass = d3.select(this).attr("class");
			d3.selectAll("." + currClass).style("opacity", 1) });

	// fill cells
	var cells = rows.selectAll("td")
		.data(function (row) {
			return columns.map(function (column) {
				if (column == "usage") {
					return {column: column, value: row[column] + "%"};
				}
				else {
					return {column: column, value: row[column]};
				};;
			});
		})
		.enter()
		.append("td")
			.text(function (d) { return d.value; });
};

/*
Capitalizes words.
Credits to Steve Harrison on Stackoverflow for this function.
*/
function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

/*
Appends a tooltip to the body of the page.
*/
function tip() {
	// initiate tooltip function
	tip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
};

/*
Loops over data of the given months.
Increments the frequency counter of a type when it's encountered.
*/
function countTypes(data) {
	// initiate list of types to count
	var typedata = [{"type": "bug", "frequency": 0}, {"type": "dark", "frequency": 0}, {"type": "dragon", "frequency": 0},
					{"type": "electric", "frequency": 0}, {"type": "fairy", "frequency": 0}, {"type": "fighting", "frequency": 0},
					{"type": "fire", "frequency": 0}, {"type": "flying", "frequency": 0}, {"type": "ghost", "frequency": 0},
					{"type": "grass", "frequency": 0}, {"type": "ground", "frequency": 0}, {"type": "ice", "frequency": 0},
					{"type": "normal", "frequency": 0}, {"type": "poison", "frequency": 0}, {"type": "psychic", "frequency": 0},
					{"type": "rock", "frequency": 0}, {"type": "steel", "frequency": 0}, {"type": "water", "frequency": 0}]

	// increment correct type on every occurance in data
	for (var key in data) {
		for (var i in typedata) {
			if (data[key].type1 == typedata[i].type) {
				typedata[i].frequency += 1;
			}
			if (data[key].type2 == typedata[i].type) {
				typedata[i].frequency += 1;
			}
		}
	}

	return typedata;
};

/*
Decides color for a bar depending on how good or bad a single type is for Landorus.
*/
function pickColor(type) {
	// default color/ neutral matchup
	var color = "blue";

	// if (dis)advantagous matchup, change color
	switch (type) {
		case "bug":
		case "electric":
		case "fighting":
		case "fire":
		case "poison":
		case "rock":
		case "steel":
			color = "green";
			break;
		case "water":
			color = "orange";
			break;
		case "ice":
			color = "red";
			break;
	}

	return color;
};

/*
Creates a bar chart representing the frequency of different types of Pokemon in the top 20.
*/
function barChart(data) {
	// remove previous bars
	d3.selectAll(".barg")
		.remove();

	// count all types
	var typedata = countTypes(data),
	typelist = ["bug", "dark", "dragon", "electric", "fairy", "fighting", "fire",
				"flying", "ghost", "grass", "ground", "ice", "normal", "poison", 
				"psychic", "rock", "steel", "water"];

	// dimensions of the bar graph
	var svg = d3.select("#barsvg"),
	margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("class", "barg").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// create x axis
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);

	x.domain(typelist.map(function(d) { return d; }));

	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	// create y axis
	y = d3.scaleLinear().rangeRound([height, 0]);

	y.domain([0, 6]);

	g.append("g")
		.attr("class", "axis axis--y")
	.call(d3.axisLeft(y).ticks(6))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Frequency");

	// draw bars
	g.selectAll(".bar")
		.data(typedata)
	.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.type); })
		.attr("y", function(d) { return y(d.frequency); })
		.style("fill", function(d) { var color = pickColor(d.type); return color })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d.frequency); });

	// initiate legend
	var legendColor = d3.scaleOrdinal()
		.range(["green", "blue", "orange", "red"]);

	var legendText = ["good matchup", "neutral matchup", "bad matchup", "very bad matchup"];

	// create legend
	var legend = g.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "end")
		.attr("class", "barlegend")
	.selectAll(".barlegendg")
	.data(legendText)
	.enter().append("g")
		.attr("class", "barlegendbox")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 19)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", legendColor);

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(function(d, i) { return legendText[i] });
};

/*
Creates a table of the top 20 most used Pokemon and their usage percentages.
Uses selectedMonth and current weight to select data.
*/
function usageTable(data, columns) {
	// clear previous table
	d3.selectAll(".usagetable")
		.remove();

	// initiate table elements
	var table = d3.select("#usagetablediv").append("table").attr("class", "usagetable"),
	thead = table.append("thead").attr("class", "usagethead"),
	tbody = table.append("tbody").attr("class", "usagetbody");

	// draw table head
	thead.append("tr")
		.selectAll("th")
		.data(["Pokemon", "Usage"]).enter()
		.append("th")
			.text(function (column) { return column; });

	// draw table row
	var rows = tbody.selectAll("tr")
		.data(data)
		.enter()
		.append("tr");

	// fill cells
	var cells = rows.selectAll("td")
		.data(function (row) {
			return columns.map(function (column) {
				if (column == "usage") {
					return {column: column, value: row[column] + "%"};
				}
				else {
						return {column: column, value: row[column]};
					};
				});
			})
		.enter()
		.append("td")
			.text(function (d) { return d.value; });
};

/*
Listens for a selection in the dropdown menu in the navbar.
If activated, updates current ranking weight and calls loadCharts.
*/
function dropdown() {
	// listen for click on list item
	$(".dropdown-menu li a").click(function(){
		
		// change button text to match current selection
		$(this).parents(".dropdown").find(".dropdown-toggle").html($(this).text() + ' <span class="caret"></span>');

		// no need to update charts if current value is selected
		if ($(this).attr("data-value") == currentWeight) {
			return NaN;
		};
		// update ranking weight
		currentWeight = $(this).attr("data-value");

		// update charts with new ranking weight
		loadCharts(currentWeight, selectedMonth);
	});
};

/*
Listens for activation of the slider.
If activated, updates selected month and calls loadCharts.
*/
function slider() {
	// check current slider position
	var slider = document.getElementById("range");
	var output = document.getElementById("month");
	output.innerHTML = monthList[0];

	// update slider info on drag
	slider.oninput = function() {
		output.innerHTML = monthList[this.value];

		selectedMonth = this.value;

		// update charts
		loadCharts(currentWeight, selectedMonth);
	}
};