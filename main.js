/*
    __  ___      _
   /  |/  /___ _(_)___
  / /|_/ / __ `/ / __ \
 / /  / / /_/ / / / / /
/_/  /_/\__,_/_/_/ /_/

Ken Lipke
November 2020
*/

// Process the data to deal with date encodings
data.forEach(function(d){
	d['date'] = new Date(d.date);
})

/*
  ___      _ _   _      _ _
 |_ _|_ _ (_) |_(_)__ _| (_)______
  | || ' \| |  _| / _` | | |_ / -_)
 |___|_||_|_|\__|_\__,_|_|_/__\___|

This is where I will build/initialize the widgets.
This probably isn't too necesary as we only have two *real*
widgets, and a few KPIs which I am just going to simply
"build" as they are just static
*/
// Build the help modal
buildHelpModal();

// Handle KPIs
buildKPIs();

// Build Chart-------------
// define defaults
let stratify = "Date";
let yStratify = "TTS";
let color = "None";
let size = "None";
let periods = [1,2,3,4,5,6]; // which periods to show
let periodNames = [
	"Breakfast", "Lunch", "Afternoon", "Dinner", "Evening", "Late Night"
]
let scatter = new Scatter({
	targetId: "chartTarget",
	data: data,
	stratifyOptions: ["Date", "Period"],
	colorOptions: ["None", "Period", "TTS"],
	sizeOptions: ["None", "TTS"]
});

let cp = new ControlPane({
	targetId: "selector",
	groupOptions: ['Date', "Period", 'TTS'],
	yGroupOptions: ['TTS', 'Date', 'Period'],
	colorOptions: ['None', "Period", "TTS"],
	sizeOptions: ["None", "TTS"],
	filterOptions: periodNames
})

/**
 * Function to handle updating across the board.
 * Now, this is really trivial here as we only have one truly dynamic widget
 * but I will keep it for good practice. If there are more widgets
 * this is an effective way to handle interdependencies, without having
 * to have each widget be aware of the others
 */
function masterUpdate(){
	scatter.update();
}
