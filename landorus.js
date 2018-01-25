/*
Casper van Velzen
11030275
Minor Programmeren / Final Project
Shows statistics on Landorus-Therian and the metagame in VGC 2015
*/

// global variables
var currentWeight, selectedMonth, lando0, lando1500, lando1630, lando1760, meta0, meta1500, meta1630, meta1760;
var monthList = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];


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
	dropdown(selectedMonth);
	slider();
};

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
    	.tickFormat(function(d, i) { return monthList[i]; }));

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
};

function pieChart(data, chartNr, chartType) {
	// clear pie chart
	d3.selectAll(".pieg" + chartNr)
		.remove();
	
	var svg = d3.select("#piesvg" + chartNr),
    width = 350,
    height = 350,
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("class", "pieg" + chartNr).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    if (chartType == "moves") {
		var color = d3.scaleOrdinal(["#BF360C", "#D84315", "#E64A19", "#F4511E", "#FF5722", "#FF7043", "#FF8A65", "#FFAB91", "#FFCCBC"]);
	}
	else {
		var color = d3.scaleOrdinal(["#0D47A1", "#1565C0", "#1976D2", "#1E88E5", "#2196F3", "#42A5F5", "#64B5F6", "#90CAF9", "#BBDEFB"]);
	}

	var tip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

	var pie = d3.pie()
	    .sort(null)
	    .value(function(d) { return data[chartType][d]; });

	var path = d3.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

	var label = d3.arc()
	    .outerRadius(radius - 40)
	    .innerRadius(radius - 40);

	var arc = g.selectAll(".arc")
		.data(pie(Object.keys(data[chartType])))
		.enter().append("g")
	    	.attr("class", "arc")
	    	.attr("class", function(d) { return (d.data + chartNr).replace(" ", "_"); });

	arc.append("path")
	    .attr("d", path)
	    .attr("fill", function(d, i) { return color(i); })
	    .on("mouseover", function(d) {
	    	tip.transition()
				.duration(200)
				.style("opacity", .9);
			tip.html(d.data + "<br/>" + d.value + "%")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
			var currClass = d3.select(this.parentNode).attr("class");
			console.log(d3.select("." + currClass).tr);
			d3.select("." + currClass).tr.style("background-color", "red");
       })
	    .on("mouseout", function(d) {
			tip.transition()
				.duration(500)
				.style("opacity", 0);
       });

	pieTable(data[chartType], [chartType, "usage"], chartNr, chartType);
};

function barChart(data) {
	// clear pie chart
	d3.selectAll(".barg")
		.remove();

	// count most common types
	var typedata = countTypes(data),
	typelist = ["bug", "dark", "dragon", "electric", "fairy", "fighting", "fire",
				"flying", "ghost", "grass", "ground", "ice", "normal", "poison", 
				"psychic", "rock", "steel", "water"];

	var svg = d3.select("#barsvg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	    y = d3.scaleLinear().rangeRound([height, 0]);

	var g = svg.append("g")
		.attr("class", "barg")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
		.attr("x", function(d) { return x(d.type); })
		.attr("y", function(d) { return y(d.frequency); })
		.style("fill", function(d) { var color = pickColor(d.type); return color })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d.frequency); });

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

function usageTable(data, columns) {
	d3.selectAll(".usagethead")
		.remove();
	d3.selectAll(".usagetbody")
		.remove();

	var table = d3.select("#usagetablediv").append('table'),
	thead = table.append('thead').attr("class", "usagethead"),
	tbody = table.append('tbody').attr("class", "usagetbody");

	thead.append('tr')
		.selectAll('th')
		.data(columns).enter()
		.append('th')
			.text(function (column) { return column; });

	var rows = tbody.selectAll('tr')
		.data(data)
		.enter()
		.append('tr');

	var cells = rows.selectAll('td')
		.data(function (row) {
	    	return columns.map(function (column) {
	      		return {column: column, value: row[column]};
	    	});
	  	})
		.enter()
		.append('td')
	    	.text(function (d) { return d.value; });

	return table;
};

function pieTable(data, columns, chartNr, chartType) {
	d3.selectAll(".pieTable" + chartNr)
		.remove();

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

	var table = d3.select("#pietablediv" + chartNr).append('table').attr("class", "pieTable" + chartNr),
	thead = table.append('thead'),
	tbody = table.append('tbody');

	thead.append('tr')
		.selectAll('th')
		.data(columns).enter()
		.append('th')
			.text(function (column) { return column; });

	var rows = tbody.selectAll('tr')
		.data(pieData)
		.enter()
		.append('tr')
		.attr("class", function(d, i) { return (d[chartType] + chartNr).replace(" ", "_"); });

	var cells = rows.selectAll('td')
		.data(function (row) {
	    	return columns.map(function (column) {
	      		return {column: column, value: row[column]};
	    	});
	  	})
		.enter()
		.append('td')
	    	.text(function (d) { return d.value; });

	return table;
};

function dropdown(selectedMonth) {
	$('.dropdown-menu li a').click(function(){
		
		$(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');

		switch ($(this).attr("data-value")) {
			case "0":
				currentWeight = "0";
				break;
			case "1500":
				currentWeight = "1500";
				break;
			case "1630":
				currentWeight = "1630";
				break;
			case "1760":
				currentWeight = "1760";
				break;
		}
		loadCharts(currentWeight, selectedMonth);
	});
}

function slider() {
	var slider = document.getElementById("range");
	var output = document.getElementById("month");
	output.innerHTML = monthList[0];

	// Update the current slider value (each time you drag the slider handle)
	slider.oninput = function() {
	    output.innerHTML = monthList[this.value];

	    selectedMonth = this.value;
	    loadCharts(currentWeight, selectedMonth);
	}
};

function loadCharts(weight, selectedMonth) {
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

function countTypes(data) {
	var typedata = [{"type": "bug", "frequency": 0}, {"type": "dark", "frequency": 0}, {"type": "dragon", "frequency": 0},
					{"type": "electric", "frequency": 0}, {"type": "fairy", "frequency": 0}, {"type": "fighting", "frequency": 0},
					{"type": "fire", "frequency": 0}, {"type": "flying", "frequency": 0}, {"type": "ghost", "frequency": 0},
					{"type": "grass", "frequency": 0}, {"type": "ground", "frequency": 0}, {"type": "ice", "frequency": 0},
					{"type": "normal", "frequency": 0}, {"type": "poison", "frequency": 0}, {"type": "psychic", "frequency": 0},
					{"type": "rock", "frequency": 0}, {"type": "steel", "frequency": 0}, {"type": "water", "frequency": 0}]

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

	return typedata
};

function pickColor(type) {
	var color = "blue";
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