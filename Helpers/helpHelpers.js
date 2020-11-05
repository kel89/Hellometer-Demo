/*
    __  __     __         __  ___          __      __
   / / / /__  / /___     /  |/  /___  ____/ /___ _/ /
  / /_/ / _ \/ / __ \   / /|_/ / __ \/ __  / __ `/ /
 / __  /  __/ / /_/ /  / /  / / /_/ / /_/ / /_/ / /
/_/ /_/\___/_/ .___/  /_/  /_/\____/\__,_/\__,_/_/
            /_/
Ken Lipke
November 2020
 */

/*
Buidls the help modal and adds it to the body...should be called ONCE
 */
function launchHelp(){
	$("#infoModal").modal("show");
}

/**
 * Shows the help modal
 */
function buildHelpModal(){
	let html = `
	<div class="modal fade" id="infoModal" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Info</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
				</div>
				<div class="modal-body">
					<h5>Welcome!</h5>
					<p>
						Thank you for checking out my Hellometer example dashboard!
						I took a look  at the data, and thought it would be fun to make a
						simple UI where someone could go and poke around it themselves.
						This is a very basic start, but I could see something like this
						with an injection of analytics and recommendations
						being something customers would use to analyze their customer data.
					</p>
					<p>
						Here is how it works:
					</p>

					<h5>Key Performance Indicators</h5>
					<img src='Assets/kpis.png' style='width:80%;'/>
					<p>
						Naturally, users' eyes traverse a dashboard from left to right
						and from top to bottom, so I like to start with a row of
						Key Performance Indicators (KPIs) on the top row.
						When looking at the data I thought a restraunt owner would
						be interested in the total number of customers served, and the
						average time to service for all customers. The third KPI was
						a bit more of a toss up, but I decided to show the time of day in which
						the time to service is lowest. With this data that is the late Evening,
						but I would be reluctant to draw any inference from that as it is
						also the smallest group. This would be a good spot for more analysis
						and more detailed recommendations.
					</p>

					<h5>Scatter Chart</h5>
					<img src='Assets/chart.png' style='width:80%;'/>
					<p>
						For a chart I decided to go with a super customizable,
						yet simple scatter plot. Each customer gets a circle. Hovering
						over any circle with give the customer number, the time of day
						they came in, and their time to service.
					</p>
					<p>
						This chart gets a lot more fun and more interesting when
						we think fo the different ways we can group, size, and color
						the data. Using the panel on the left (which is explained below)
						the user can group the data by the time of day, size it by the time to service
						or color it by the time of day. This is all very basic, and
						for this specific data when I don't see any huge trends jump out.
						I find the most useful view to be grouping the X axis by the Period
						and leaving the y as TTS. Here we can see that "Late Night" has
						very few customers, but great servaice times. We see that Evening and Dinner have
						giant outliers that might be worth investigating further. We can
						also use the opacity of the dots as a sort of rough histogram
						and pick out averages and standard deviations. <i>(this would be a great
						spot to inject more robust statistics like a box and whiskey plot,
						or actually include histograms vertically next to each cluster)</i>
					</p>

					<h5>Control Pannel</h5>
					<img src='Assets/control_pane.png' style='height:80%;'/>
					<p>
						Finally, the control panel on the left side gives the
						user the options to change the X and Y axis variables, the
						size and color variables, as well as to filter on the times
						of days that we actually want to see.
					</p>

					</p>
						The drop-downs are pretty straightforward. Click on a new option
						and the chart will automatically update. The filters are multi-select.
						By default, they are all included, and this is denoted by the nice blue color.
						Clicking will toggle its inclusion--which is indicated by a change in color.
						The filters are also automatically applied.
					</p>

					<p>
						Thanks again for taking a look! Please feel free to
						<a href="mailto:kenlipke@me.com">reach out</a>
						if you have any questions about what, why, or how I did something!
					</p>
				</div>
			</div>
		</div>
	</div>
	`

	$("body").append(html);
}
