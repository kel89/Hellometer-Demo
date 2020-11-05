/*
   ______            __             __   ____
  / ____/___  ____  / /__________  / /  / __ \____ _____  ___
 / /   / __ \/ __ \/ __/ ___/ __ \/ /  / /_/ / __ `/ __ \/ _ \
/ /___/ /_/ / / / / /_/ /  / /_/ / /  / ____/ /_/ / / / /  __/
\____/\____/_/ /_/\__/_/   \____/_/  /_/    \__,_/_/ /_/\___/

Ken Lipke
November 2020
*/


var ControlPane = function(config) {
	// Set defaults
	this.targetId = null;
	this.group = "None";
	this.color = "None";
	this.size = "None";
	this.filters = [];

	// Load in config
	Object.keys(config).forEach(key => this[key] = config[key]);

	// Initialize sequence
	this.writeHTML();
	this.fillOptions();
	this.attachHandlers();
}

/**
 * Write HTML shell for control pane, includes space for toggles
 * of group, color, size, as well as multi select for filter
 * has a duplicate help button, as well as spaces for descriptions
 */
ControlPane.prototype.writeHTML = function() {
	// Helper function to structure dropdowns
	function makeDropdown(title, desc, id) {
		let html = `
	<div class='row mb-2'>
		<h6>${title}</h6><br>
		<p>${desc}</p>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<label class="input-group-text" for="${id}">${title}</label>
			</div>
			<select class="custom-select" id="${id}"></select>
		</div>
	</div>
	`
		return html;
	}

	// Make HTML will all dropdowns and filters
	let html = `
	<div class='container-fluid'>
		${makeDropdown("X Variable",
			"Choose how customers are grouped along the X axis",
			"groupDropdown")}
		${makeDropdown("Y Variable",
			"Choose how customers are grouped along the Y axis",
			"yGroupDropdown")}
		${makeDropdown("Color By",
			"Determine how customer circles are shaded",
			"colorDropdown")}
		${makeDropdown("Size By",
			"Determine the scale used for the size of customer circles",
			"sizeDropdown")}

		<!-- Filter Multi-Select -->
		<div class='row mb-2'>
			<h6>Filter</h6>
			<p>Select the part of the day to be included in the graph</p>
			<div id='filterGroup'></div>
		</div>
	</div>
	`;

	$("#" + this.targetId).html(html);
}

/**
 * Fills in the various options for the dropdowns and filters
 */
ControlPane.prototype.fillOptions = function() {
	let _this = this;

	// Helper function to fill dropdowns
	// assumes the default is first option
	function fillDropdown(id, options){
		let html = ``;
		options.forEach(function(opt, i){
			html += `
			<option ${i == 0 ? 'selected' : ''}>${opt}</option>
			`;
		});
		$("#"+id).html(html);
	}

	// Fill dropdowns with helpers
	fillDropdown("groupDropdown", this.groupOptions);
	fillDropdown("yGroupDropdown", this.yGroupOptions);
	fillDropdown("colorDropdown", this.colorOptions);
	fillDropdown("sizeDropdown", this.sizeOptions);

	// Make filter cards
	let filterHtml = '';
	this.filterOptions.forEach(function(opt, i){
		filterHtml += `
		<div class='filterOption selectedFilter' ind="${i+1}">
			${opt}
		</div>
		`;
	});
	$("#filterGroup").html(filterHtml);
}

/**
 * Attaches handles to dropdowns to call the correct scatter update method
 * Attaches handler to filter options to first call the filter helper
 * which updates the filter list we are currently tracking
 * @return {[type]} [description]
 */
ControlPane.prototype.attachHandlers = function() {
	$("#groupDropdown").change(function(){
		// Update global
		stratify = $("#groupDropdown").val();

		// Update chart
		masterUpdate();
	});

	$("#yGroupDropdown").change(function(){
		// Update global
		yStratify = $("#yGroupDropdown").val();

		// Update chart
		masterUpdate();
	});

	$("#colorDropdown").change(function(){
		// Update global
		color = $("#colorDropdown").val();

		// Update chart
		masterUpdate();
	});

	$("#sizeDropdown").change(function(){
		// Update global
		size = $("#sizeDropdown").val();

		// Update chart
		masterUpdate();
	});

	// Attach filter handlers
	$(".filterOption").click(function(){
		// determine which was click
		let which = $(this).attr('ind')*1;

		// Toggle its status
		$(this).toggleClass("selectedFilter");

		// Toggle its place in tracker
		if (periods.indexOf(which) == -1){
			// add it
			periods.push(which);
		}
		else{
			// remove it
			periods = periods.filter(x => x != which);
		}

		// update
		masterUpdate();
	})
}
