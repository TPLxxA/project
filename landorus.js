/**
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

	function dataLoaded(error, l0, l1500, l1630, l1760, m0, m1500, m1630, m1760) {
		if (error) throw error;
		lineGraph(l0);

		// barChart(m0[0])

		};

	// TODO: make it actually work
	function lineGraph(data) {
		// remove previous line
		d3.selectAll(".g")
			.remove();

		/*
		Bug: svg.attr is "100%" due to being variable thanks to bootstrap
		this means width = NaN, making it incompatible with d3 functions
		Solution: dimensions of bounding box?!?
		LITERALLY DON'T EVEN TRY TO SOLVE THIS BS
		*/
		var svg = d3.select("#linesvg"),
    	margin = {top: 30, right: 30, bottom: 30, left: 30},
        bbox = linesvg.width.animVal.value,
        width = bbox - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom,
    	g = svg.append("g").attr("class", "lineg").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    	var x = d3.scaleLinear()
    		.domain(function(d, i) { return d.month; })
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
			// .enter()
			// 	.append("path")
				.attr("fill", "none")
				.attr("stroke", "steelblue")
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 1.5 )
				.attr("d", line);
	}


	// TODO: add pie charts
	function pieChart(data) {
		// clear pie chart
		d3.selectAll(".g")
			.remove();
		};


	// TODO: make this work
	function barChart(data) {
		var svg = d3.select("#barsvg"),
	    margin = {top: 20, right: 20, bottom: 120, left: 40},
	    width = +svg.attr("width") - margin.left - margin.right,
	    height = +svg.attr("height") - margin.top - margin.bottom,
	    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  var x0 = d3.scaleBand()
	      .rangeRound([0, width])
	      .paddingInner(0.1);

	  var x1 = d3.scaleBand()
	      .padding(0.05);

	  var y = d3.scaleLinear()
	      .rangeRound([height, 0]);

	  var z = d3.scaleOrdinal()
	      .range(["steelblue"]);

	  // // keeping this here from my other project because I need to remember how to write for loops
	  // var data = [];
	  // // si and qoli json files are in the same order
	  // for (var i = 0; i < 20; i += 1) {
	  // 	data[i] = {country: qoli_data[i]['country'], qoli: qoli_data[i]['qoli'], si: safety_index_data[i]['safety_index']};
	  // }

	  // decide what data is used for each bar
	  var types = ['fire', 'steel', 'flying']
	  var keys = ['fire'];

	  // THIS RETURN TYPES THING IS MOST LIKELY TROUBLE
	  // TODO: actually count the types from data with for loop
	  x0.domain(data.map(function(d) { return types; }));
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

      // create bars
      g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.country) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); });

        // create x axis
		g.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0))
        .selectAll("text")
          .style("text-anchor", "end")
    	  .attr("dx", "-.8em")
    	  .attr("dy", "-.75em")
          .attr("transform", "rotate(-90)")
          .on("mouseover", function(d) { d3.select(this).style("cursor", "pointer"); })
          .on("mouseout", function(d) { d3.select(this).style("cursor", "default"); })
          // calls line graph function with data for correct country
          .on("click", function(d) { for (var i = 0; i < 28; i = i + 1) {
          	if (d == ppi_all_data[i]['country']) {
          	console.log(d);
          	line_graph(ppi_all_data[i]);
          	};
          }; 
      });

        // create y axis
	    g.append("g")
	        .attr("class", "axis")
	        .call(d3.axisLeft(y).ticks(null, "s"))
	      .append("text")
	        .attr("x", 2)
	        .attr("y", y(y.ticks().pop()) + 0.5)
	        .attr("dy", "0.32em")
	        .attr("fill", "#000")
	        .attr("font-weight", "bold")
	        .attr("text-anchor", "start")
	        .text("Index score");

	    // create legend
	    var legend = g.append("g")
	        .attr("font-family", "sans-serif")
	        .attr("font-size", 10)
	        .attr("text-anchor", "end")
	      .selectAll("g")
	      .data(keys.slice().reverse())
	      .enter().append("g")
	        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	    legend.append("rect")
	        .attr("x", width - 19)
	        .attr("width", 19)
	        .attr("height", 19)
	        .attr("fill", z);

	    legend.append("text")
	        .attr("x", width - 24)
	        .attr("y", 9.5)
	        .attr("dy", "0.32em")
	        .text(function(d, i) { if (i == 0) { return 'quality of life'} else { return 'safety'} });
		};

	// TODO: add dropdown menu
	function dropdown() { console.log('Hi I am a dropdown menu function, but I currently do not work :/')};