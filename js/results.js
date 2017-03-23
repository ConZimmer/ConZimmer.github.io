/*	var edin_pop = 495360;
    var glasgow_pop = 598830;
    var aberdeen_pop = 228990;
    var Dundee_pop = 148210;


    var edin = {
        'yes': .40*edin_pop,
        'no': .50*edin_pop,
        'maybe': .10*edin_pop
    }

    var glasg = {
        'yes': .70*glasgow_pop,
        'no': .20*glasgow_pop,
        'maybe': .10*glasgow_pop
    }

    var aber = {
        'yes': .20*aberdeen_pop,
        'no': .75*aberdeen_pop,
        'maybe': .5*aberdeen_pop
    }

    var dun = {
        'yes': .45*Dundee_pop,
        'no': .45*Dundee_pop,
        'maybe': .90*Dundee_pop
    }

    var data = [
        {districtName: "edin", yes: edin.yes, no: edin.no, maybe: edin.maybe},
        {districtName: "glasgow", yes: glasg.yes, no: glasg.no, maybe: glasg.maybe},
        {districtName: "aberdeen", yes: aber.yes, no: aber.no, maybe: aber.maybe},
        {districtName: "Dundee", yes: dun.yes, no: dun.no, maybe: dun.maybe},
        {districtName: "r1", yes: 5, no:5, maybe:5},
        {districtName: "r2", yes: 10, no:5, maybe:5}
    ];
	
	var dataTotal = [{districtName: "total", yes: edin.yes + glasg.yes + aber.yes + dun.yes, no: edin.no + glasg.no + aber.no + dun.no, maybe: edin.maybe + glasg.maybe + aber.maybe + dun.maybe}];

    var dataBubble =[
        {districtName: "edin", votes: edin.yes + edin.no + edin.maybe},
        {districtName: "glasgow", votes: glasg.yes + glasg.no + glasg.maybe},
        {districtName: "aberdeen", votes: aber.yes + aber.no + aber.maybe},
        {districtName: "Dundee", votes: dun.yes + dun.no + dun.maybe},
        {districtName: "r1", votes: 38000},
        {districtName: "r2", votes: 10000},
        {districtName: "r3", votes: 1000000},
        {districtName: "r4", votes: 700000}
    ];*/

var chartsDrawn = false;

function drawDonutCharts(radius, innerRadius, data, idDiv, choices, colors){
	let padding = 10;

	let color = d3.scaleOrdinal()
		//.range(["#98abc5", "#8a89a6", "#7b6888"]);
		.range(colors);

	let arc = d3.arc()
		.outerRadius(radius)
		.innerRadius(innerRadius);

	let pie = d3.pie()
		.sort(null)
		.value(function(d) { return d.value; });
		
	color.domain(choices);
	data.forEach(function(d) {
		d.votes = color.domain().map(function(name) {
			return {name: name, value: +d[name]};
		});
	});
	if(!chartsDrawn){
		let legend = d3.select("body").select(idDiv).append("svg")
			.attr("class", "legend")
			.attr("width", radius * 1.5)
			//.attr("height", radius * 2)
			.attr("height", radius)
			.selectAll("g")
			.data(color.domain().slice().reverse())
			.enter().append("g")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

		legend.append("text")
			.attr("x", 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.text(function(d) { return d; });
	}

	let svg = d3.select("body").selectAll(idDiv).selectAll(".pie")
		.data(data)
		
		.enter().append("svg")
		.attr("class", "pie")
		.attr("width", radius * 2)
		.attr("height", radius * 2)
		.append("g")
		.attr("transform", "translate(" + radius + "," + radius + ")");
	
	let tooltip = d3.select("body").select(idDiv).select(".tooltip");
	if(!chartsDrawn){
		tooltip = d3.select("body").select(idDiv)
			.append("div")
			.attr("class", "tooltip")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden")
			.style("background-color","white")
			.style("color","black")
			.style("border-radius", "10px")
			.style("padding", "10px");
	}


	svg.selectAll(".arc")
		.data(function(d) { return pie(d.votes); })
		
		.enter().append("path")
		.attr("class", "arc")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data.name); })
		.on("mouseover", function(d){
			d3.select(this).style("stroke","blue");
			tooltip.text(d.data.name + ": " + d.value);
			return tooltip.style("visibility", "visible");
		})
		//.on("mousemove", function(event){return tooltip.style("top", (d3.event.pageY -150)+"px").style("left",(d3.event.pageX - 300)+"px");})
		.on("mousemove", function(event){return tooltip.style("top", (d3.event.pageY - 15)+"px").style("left",(d3.event.pageX +10)+"px");})
		//.on("mousemove", function(event){return tooltip.style("top", (d3.select(this).attr("cy")-10)+"px").style("left",(d3.select(this).attr("cx")+10+10)+"px");})
		.on("mouseout", function(){
			d3.select(this).style("stroke", "white");
			return tooltip.style("visibility", "hidden");
		});
		


	svg.append("text")
		.attr("dy", ".35em")
		.style("text-anchor", "middle")
		.text(function(d) {return d.districtName;});
}


function drawBubbleChart(data, idDiv){
	var div = d3.select(idDiv);
	
	//var svg = d3.select("body").select(idDiv).select("svg"),
	var svg = d3.select(idDiv).select("svg"),
	width = +svg.attr("width"),
		height = +svg.attr("height");
	
	var format = d3.format(",d");

	var colorBubbleChart = d3.scaleOrdinal(d3.schemeCategory20c);

	var pack = d3.pack()
		.size([width, height])
		.padding(1.5);
	/*
	d3.csv("flare.csv", function(d) {
		d.value = +d.value;
		if (d.value) return d;
	}, function(error, classes) {
		if (error) throw error;*/

	var root = d3.hierarchy({children: data})
		.sum(function(d) { return d.votes; })
		.each(function(d) {
			if (id = d.data.districtName) {
				var id, i = id.lastIndexOf(".");
				d.id = id;
				d.package = id.slice(0, i);
				d.class = id.slice(i + 1);
			}
		});
		
	let tooltip = d3.select("body").select(idDiv).select(".tooltip");
	if(!chartsDrawn){
		tooltip = d3.select("body").select(idDiv)
			.append("div")
			.attr("class", "tooltip")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden")
			.style("background-color","white")
			.style("color","black")
			.style("border-radius", "10px")
			.style("padding", "10px");
	}

	var node = svg.selectAll(".node")
		.data(pack(root).leaves())
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	node.append("circle")
		.attr("id", function(d) { return d.id; })
		.attr("r", function(d) { return d.r; })
		.style("fill", function(d) { return colorBubbleChart(d.package); })
	.on("mouseover", function(d){
		d3.select(this).style("stroke","blue");
		tooltip.text("Voter count: " + d.value);
		return tooltip.style("visibility", "visible");
	})
	.on("mousemove", function(event){return tooltip.style("top", (d3.event.pageY - 15)+"px").style("left",(d3.event.pageX +10)+"px");})
	.on("mouseout", function(){
		d3.select(this).style("stroke", "white");
		return tooltip.style("visibility", "hidden");
	});

	node.append("clipPath")
		.attr("id", function(d) { return "clip-" + d.id; })
		.append("use")
		.attr("xlink:href", function(d) { return "#" + d.id; });

	node.append("text")
		.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
		.selectAll("tspan")
		.data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
		.enter().append("tspan")
		.attr("x", 0)
		.attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
		.text(function(d) {return d; });
}


function drawCharts(choices, totalVotes, districtData){
	let dataTotal = [];
	dataTotal[0] = {districtName:"Total"};
	for(let i in choices){
		dataTotal[0][choices[i]] = totalVotes[choices[i]];
	}
	let dataDistrict = [];
	let dataBubble = [];
	for(let i in districtData){
		let resp = districtData[i][0].response;
		let respObj = JSON.parse(resp);
		let districtVotes = respObj.TotalVotes;
		let dataEntryDistrict = {districtName: respObj.DistrictName};
		let sumVotes = 0;
		for(let j in choices){
			dataEntryDistrict[choices[j]] = districtVotes[choices[j]];
			sumVotes += districtVotes[choices[j]];
		}
		if(sumVotes != 0)
			dataDistrict.push(dataEntryDistrict);
		let dataEntryBubbleChart = {districtName: respObj.DistrictName, votes: sumVotes};
		if(dataEntryBubbleChart.votes != 0)
			dataBubble.push(dataEntryBubbleChart);
	}
	console.log("data district ", dataDistrict );
	/*console.log(dataTotal);
	console.log(data); 
	console.log(dataBubble);*/ 
	let colors = ["#98abc5", "#8a89a6", "#7b6888"];
	drawDonutCharts(74, 44,  dataDistrict, "#districtResultCharts", choices, colors);
	drawDonutCharts(150,100, dataTotal, "#totalResults", choices, colors );
	if(dataBubble.length != 0)
		drawBubbleChart(dataBubble, "#bubbleChart");
	chartsDrawn = true; 
}



function poll(){
	   setTimeout (function () {
		  multAjaxCallResults(0,10);
	 }, 5000);
}

function deleteCharts(){
	let svg = d3.select("body").selectAll("#totalResults").selectAll(".pie");
	svg.remove();
	 svg = d3.select("body").selectAll("#districtResultCharts").selectAll(".pie");
	svg.remove();
	let node =  d3.select("#bubbleChart").select("svg").selectAll(".node");
	node.remove();
	
}
var timeout;
function emptyResultsSection(){
	$("#resultsSection").empty();
	clearTimeout(timeout);
}
/*
function removeMessage(){
	$(".resultsMessage").remove();
}*/

function displayMessage(message){
	$("#resultsSection").append($('<h1>').text(message).addClass("resultsMessage"));
}

function addContainersForCharts(){
	$("#resultsSection").append($('<h5>').text("Total Results"));
	$("#resultsSection").append($('<div>').attr("id", "totalResults"));
	$("#resultsSection").append($('<h5>').text("Per District Results"));
	$("#resultsSection").append($('<div>').attr("id","districtResultCharts"));
	$("#resultsSection").append($('<h5>').text("Vote Counts Per District"));
	$("#resultsSection").append($('<div>').attr("id","bubbleChart"));
	let widthBubbleChart = 	0.7 * $( ".row.section-intro").width();
	console.log(widthBubbleChart);
	let leftMargin = 0.15 * $(window).width();
	let rightMargin = 0.15 * $(window).width();
	//d3.select("#bubbleChart").append("svg").attr("width","400").attr("height","400").attr("text-anchor","middle").attr("font-size","10");
	d3.select("#bubbleChart").append("svg").attr("width", widthBubbleChart).attr("height","400").attr("text-anchor","middle").attr("font-size","10");
}

function noVotes(voteOptions, votes){
	let totalCount = 0; 
	for(let i in voteOptions){
		totalCount += votes[voteOptions[i]];
	}
	
	return totalCount ===0;
}

function afterDate(endDateString){
	let endDate = new Date(endDateString);
	let currentDate = new Date().getTime();
	return currentDate > endDate
}

function addCountDown(endTimeStr){
	$("#resultsSection").append($('<h1>').attr("id","countDown"));
	let tick = function(){
		let date1 = new Date(endTimeStr);
		let date2 = new Date();
		let timeDiff = date1.getTime()- date2.getTime();
		if(timeDiff > 0){
			let days = Math.floor(timeDiff / (1000 * 3600 * 24));
			timeDiff -= (days * (1000 * 3600 * 24));
			let hours = Math.floor(timeDiff / (1000 * 3600));
			timeDiff -= hours *1000 * 3600;
			let mins = Math.floor((timeDiff / ( 1000 * 60)));
			timeDiff -= mins * 1000 * 60;
			let sec = Math.floor(timeDiff / 1000);
			$("#countDown").text(days +":" +hours + ":" + mins + ":" + sec );
		}
		timeout = setTimeout(tick, 1000);
	}
	tick();
}

var baseUrl = "https://blockvotenode2.mybluemix.net";
//var baseUrl = ""
var wasDisplayingMessage = true;
var displayVoitingStartsMessage = false;
var display

//perform multiple ajax calls in a loop if the server responds with error.
function multAjaxCallResults(count, finalCount){
	if(count < finalCount){
		$.ajax({
			url:baseUrl + "/results",
			crossDomain: true,
			success:function(resp){
				if(resp.error == null){
					let response = JSON.parse(resp.response);
					let voteOptions = response.VoteOptions;
					
					if(!afterDate(response.StartTime)){
						emptyResultsSection();
						displayMessage("Voting starts in");
						addCountDown(response.StartTime);
						wasDisplayingMessage = true;
						poll();
						return;
					}
					
					if(response.AllowLiveResults === "no" && !afterDate(response.EndTime)){
						emptyResultsSection();
						displayMessage("Come back when the election is over to see results");
						displayMessage("Time to end of election");
						addCountDown(response.EndTime);
						wasDisplayingMessage = true;
						poll();
						return;
					}
					
					if(noVotes(voteOptions, response.TotalVotes)){
						emptyResultsSection();
						displayMessage("No Votes Yet");
						wasDisplayingMessage = true;
						poll();
						return;
					}
					if(wasDisplayingMessage){
						emptyResultsSection();
						addContainersForCharts();
						wasDisplayingMessage = false;
					}
					
					let districts = response.Districts;
					let calls = [];
					for(let i in districts){
						
						let call = $.ajax({
							type:"POST",
							url:baseUrl + "/readDistrict",
							crossDomain: true,
							data: { "district":districts[i]},
							failure:function(obj, status, textStatus){
								console.log("failure when getting district data");
							}
							
						});
						calls.push(call);
						
					}
					$.when.apply(null, calls).then(function(){
						let dataOK = true;
						for(let i in arguments){
							let resp = arguments[i][0];
							if(resp.error != null)
							{
								dataOK = false;
								count++;
								console.log("here");
								multAjaxCallResults(count, finalCount);
							}
						}
						if(dataOK){
							deleteCharts();
							drawCharts(voteOptions, response.TotalVotes , arguments);
							poll();
						}
					});
				}
				else{
					count ++;
					multAjaxCallResults(count, finalCount);
				}
			},
			failure:function(obj, status, textStatus){
				console.log("failure when getting results");
			}
		});
	}
}
	

$(window).load(function(){
	multAjaxCallResults(0, 10);
	
	
	/*$.ajax({
		url:"https://blockvotenode2.mybluemix.net/results",
		crossDomain: true,
		success:function(resp){
			/*console.log(resp);
			console.log(resp.response);*/
			/*let response = JSON.parse(resp.response);
			/*console.log(response);
			console.log("voteOptions:" + response.VoteOptions);
			console.log("Districts:" + response.Districts);*/
			/*let vOp = response.VoteOptions;
			let districts = response.Districts;
			let calls = [];
			for(let i in districts){
				let call = $.ajax({
					type:"POST",
					url: "https://blockvotenode2.mybluemix.net/readDistrict",
					crossDomain: true,
					data: { "district":districts[i]},
					failure:function(obj, status, textStatus){
						console.log("problem getting district data");
					}
					
				});
				
				calls.push(call);
				
			}
			$.when.apply(null, calls).then(function(){
				drawCharts(response.VoteOptions, response.TotalVotes , arguments);
			});
		},
		failure:function(obj, status, textStatus){
			console.log("fail");
		}
	});*/
	/*
	let choices = ["yes","no","maybe"];
		let colors = ["#98abc5", "#8a89a6", "#7b6888"];
	drawDonutCharts(74, 44,  data, "#districtResultCharts", choices, colors);
	drawDonutCharts(150,100, dataTotal, "#totalResults", choices, colors );
	drawBubbleChart(dataBubble, "#bubbleChart");*/
});