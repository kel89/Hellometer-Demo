/*
   _____            __  __
  / ___/_________ _/ /_/ /____  _____
  \__ \/ ___/ __ `/ __/ __/ _ \/ ___/
 ___/ / /__/ /_/ / /_/ /_/  __/ /
/____/\___/\__,_/\__/\__/\___/_/

Ken Lipke
November 2020
*/

var Scatter = function(config){
	// Set defaults
	this.targetId = null;
	this.data = null;
	this.margin = {top: 20, right: 20, bottom: 50, left: 80};

	// Load in config
	Object.keys(config).forEach(key => this[key] = config[key]);

	// Initialize sequence
	this.writeHTML();
	this.setupSVG();
	this.setupData();
	this.setupScales();
	this.setupAxes();
	this.plot();
}

/**
Normally, this is where I would put in some HTML scaffolding
with something of a title bar, other options like dropdown
and and info button to help explain....this is a quick excerise
so I will largely skip this and just slot in a tooltip
*/
Scatter.prototype.writeHTML = function(){
	// Add tooltip
	$("body").append(`
		<div class='myTooltip' id='tooltip'></div>
	`)
}

/**
Makes and appends SVG to target, sizing it, and adding the main G
*/
Scatter.prototype.setupSVG = function(){
	// Get the sizes
	this.width = $("#"+this.targetId).width();
	this.height = $("#"+this.targetId).height();
	this.chartWidth = this.width - this.margin.left - this.margin.right;
	this.chartHeight = this.height - this.margin.top - this.margin.bottom;

	// Add the svg
	this.svg = d3.select("#"+this.targetId)
		.append('svg')
		.attr('id', 'chartSVG')
		.attr("width", this.width)
		.attr("height", this.height);

	this.g = this.svg
		.append('g')
		.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
}

Scatter.prototype.setupData = function(){
	// All we have to do here is filter to show periods of interest
	this.data = data.filter(x => periods.indexOf(x.day_part) != -1);
}

/**
Determines the X and Y scales based on the parameters
*/
Scatter.prototype.setupScales = function(){
	if (stratify == "None"){
		this.x = d3.scaleTime()
			.domain(d3.extent(this.data.map(x => x.date)));
	}
	if (stratify == "Period"){
		this.x = d3.scaleBand()
			.domain([1,2,3,4,5,6]);
	}

	this.y = d3.scaleLinear()
		.domain([0, d3.max(this.data.map(x => x.tts))]);

	// Other setupScales
	if (size == "TTS"){
		this.sizeScale = d3.scaleLinear()
			.domain(d3.extent(data.map(d => d.tts)))
			.range([2, 10]);
	}
}

/**
Takes in a datapoint and returns y coord
*/
Scatter.prototype.getX = function(d){
	if (stratify == "Period"){
		let bw = this.x.bandwidth();
		return this.x(d.day_part) + bw/2
			+ d3.randomUniform(-1*bw/4, bw/4)();
	}
	else{
		return this.x(d.date);
	}
}

/**
Takes in a data point and returns y coord
*/
Scatter.prototype.getY = function(d){
	return this.y(d.tts);
}

Scatter.prototype.getR = function(d){
	if (size == "TTS"){
		return this.sizeScale(d.tts);
	}
	else{
		// Return default size
		return 5;
	}
}

Scatter.prototype.getColor = function(d){
	if (color == "Period"){
		// Color category
		return d3.schemeCategory10[d.day_part]
	}
	else{
		// Default Hellometer color
		return "#3AA3F2";
	}

}

/**
To be called only ONCE, makes the axes G and axis objects
*/
Scatter.prototype.setupAxes = function(){
	// add the ranges
	this.x.range([0, this.chartWidth]);
	this.y.range([this.chartHeight, 0]);

	// make Axis objects
	this.xAxis = d3.axisBottom(this.x);
	this.yAxis = d3.axisLeft(this.y);

	// Add g's
	this.xAxisG = this.g.append('g')
		.attr('id', 'xAxisG')
		.attr('transform', `translate(0, ${this.chartHeight})`)
		.call(this.xAxis);
	this.yAxisG = this.g.append('g')
		.attr('id', 'yAxisG')
		.attr('transform', `translate(0, 0)`)
		.call(this.yAxis);

	// Add labels
	this.xAxisLabel = this.g
		.append('g')
		.attr('id', 'xAxisLabel')
		.attr('transform', `translate(${this.chartWidth/2}, ${this.chartHeight + .75*this.margin.bottom})`)
		.append('text')
		.style('text-anchor', 'middle')
		.text(stratify == "None" ? "Date" : stratify)

	this.yAxisLabel = this.g
		.append('g')
		.attr('id', 'yAxisLabel')
		.attr('transform', `translate(${-.75*this.margin.left}, ${this.chartHeight/2}) rotate(270)`)
		.append('text')
		.style('text-anchor', 'middle')
		.text("Time to Service")
}

/**
To be called each time we want to update the plot,
transitions the axes to represent new scales (if any)
*/
Scatter.prototype.updateAxes = function(){
	this.x.range([0, this.chartWidth]);
	this.y.range([this.chartHeight, 0]);

	// Update the axes
	this.xAxis = d3.axisBottom(this.x);
	this.yAxis = d3.axisLeft(this.y);

	// Map the periods to text
	if (stratify == "Period"){
		let keys = [
			"Breakfast", "Lunch", "Afternoon", "Dinner", "Evening", "Late Night"
		];
		this.xAxis.tickFormat((d,i) => keys[i]);
	}

	this.xAxisG.transition()
		.call(this.xAxis);
	this.yAxisG.transition()
		.call(this.yAxis);



	// Update the labels
	this.xAxisLabel.text(stratify == "None" ? "Date" : stratify)
}

Scatter.prototype.plot = function(){
	let _this = this;

	let pointSet = this.g.selectAll(".point")
		.data(this.data, d => d.customer_number);

	let newPoints = pointSet.enter()
		.append('circle')
		.attr('class', 'point')
		.attr('cx', d => this.getX(d))
		.attr('cy', d => this.getY(d))
		.attr('r', d => this.getR(d))
		.attr('fill', d => this.getColor(d))
		.style('opacity', 0)
		.on('mouseover', function(event, d){
			_this.highlight(event, d);
		})
		.on('mousemove', function(event, d){
			_this.moveTooltip(event, d);
		})
		.on('mouseout', function(event, d){
			_this.unhighlight(event, d);
		});

	// transition in the new points
	newPoints.transition()
		.style('opacity', null);

	// Move the current points
	pointSet
		.transition()
		.attr('cx', d => this.getX(d))
		.attr('cy', d => this.getY(d))
		.attr('r', d => this.getR(d))
		.attr('fill', d => this.getColor(d));

	// Remove the old points
	pointSet.exit()
		.transition()
		.style('opacity', 0)
		.on('end', function(){
			pointSet.exit().remove();
		})
}

/**
Called to update the plot, setsup data,
updates scales, updates axes, and re-plots
*/
Scatter.prototype.update = function(){
	this.setupData();
	this.setupScales();
	this.updateAxes();
	this.plot();
}

/**
Takes in the data for a circle and a refernce to it
highlights it and produce a myTooltip
*/
Scatter.prototype.highlight = function(event, d){
	// fill tooltip
	$("#tooltip").html(`
		<b>Customer: </b>${d.customer_number}<br>
		<b>Time of Day: </b>${d.day_part}<br>
		<b>TTS: </b>${d.tts}
	`);

	d3.select("#tooltip")
		.style("top", (event.pageY - 20) + "px")
		.style("left", (event.pageX - 30) + "px")
		.style('display', 'block');
};

/**
Takes in data and reference to circle, and amoves the tooltip
*/
Scatter.prototype.moveTooltip = function(event, d){
	d3.select("#tooltip")
		.style("top", (event.pageY - 20) + "px")
		.style("left", (event.pageX + 20) + "px");
}

/**
unhighlights and hides myTooltip
*/
Scatter.prototype.unhighlight = function(event, ){
	d3.select("#tooltip")
		.style('display', 'none');
}
