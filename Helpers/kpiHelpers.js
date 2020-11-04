/*
    __ __ ____  ____   __  __     __
   / //_// __ \/  _/  / / / /__  / /___  ___  __________
  / ,<  / /_/ // /   / /_/ / _ \/ / __ \/ _ \/ ___/ ___/
 / /| |/ ____// /   / __  /  __/ / /_/ /  __/ /  (__  )
/_/ |_/_/   /___/  /_/ /_/\___/_/ .___/\___/_/  /____/
                               /_/
Ken Lipke
November 2020
*/

/**
Function to build the 3 KPIS, calls build functions
for each of the KPIs, which are themselves responsible
for getting the desired data
*/
function buildKPIs(){
	buildCustomersServerdKPI();
	buildAverageTTSKPI();
	buildEfficiencyKPI();
}

/**
Determines the total customers served from the data
and places it in kpi1
*/
function buildCustomersServerdKPI(){
	let count = data.length;
	$("#kpi1").html(count.toLocaleString());
}

/**
Determiens the average TTS and places it in kpi2
*/
function buildAverageTTSKPI(){
	// Get the total TTS
	let total = d3.sum(data.map(x => x.tts));
	let avg = total/data.length;
	let f = d3.format(",.1f")
	$("#kpi2").html(f(avg) + "s");
}

/**
Looks at the average TTS for all times of day
and determines which period is best, and displays it in kpi3
*/
function buildEfficiencyKPI(){
	/*
	Reduce data into a dictionary mapping period: [count, sum]
	once we have that we can use the count and sum to get mean
	*/
	let periodDict = data.reduce(function(acc, cur){
		let period = ''+cur.day_part;
		let tts = cur.tts;
		if (Object.keys(acc).indexOf(period) == (''+-1)){
			// not in dict yet, add it
			acc[period] = [1, tts];
		}
		else{
			// already ther, so just update
			let arr = acc[period];
			arr[0] = arr[0] + 1;
			arr[1] = arr[1] + tts;
		}
		return acc
	}, {});

	// Calculate the averages and get best
	let bestPeriod;
	let bestTTS = Number.POSITIVE_INFINITY;
	Object.keys(periodDict).forEach(function(key){
		let avg = periodDict[key][1]/periodDict[key][0];
		periodDict[key] = avg;
		if (avg < bestTTS){
			bestPeriod = key;
			bestTTS = avg;
		}
	});

	let mapping = {
		'1': "Breakfast",
		'2': "Lunch",
		'3': "Afternoon",
		'4': "Dinner",
		'5': "Evening",
		'6': "Late Night"
	}

	$("#kpi3").html(mapping[bestPeriod]);
}
