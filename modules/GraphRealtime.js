var React = require('react');
var average_array = [];
var data_delay = 10000;
// Data
		var real_time = new TimeSeries();
		var avg_time = new TimeSeries();

// Chart Syle 
var chart_style = {
	grid: {strokeStyle:'transparent', fillStyle:'transparent'},
	labels:{disabled:true},
	maxValue:1,
	minValue:-1
};

// Real Time Chart Sytle
var real_time_style = {
	strokeStyle:'#5C90CB', 
	lineWidth:4
};

// Avg Time Chart Sytle
var avg_time_style = {
	strokeStyle:'#A7A9AB', 
	lineWidth:1,
};

var prevAggregate = -2;


var GraphRealtime = React.createClass({
	componentDidMount: function(){

		// Create Smoothie Graph
		var smoothie = new SmoothieChart(chart_style);
		var graph = React.findDOMNode(this.refs.graph);
		smoothie.streamTo(document.getElementById("graph-realtime"), data_delay);

		// Add a random value to each line every second
		/*setInterval(function() {
			var sentiment_value = Math.random()*2 -1;;
			calculateData(sentiment_value);
		}, data_delay);*/

		smoothie.addTimeSeries(avg_time, avg_time_style);
		smoothie.addTimeSeries(real_time, real_time_style);

	},
	render: function(){
		console.log("aggregate: " + this.props.aggregate);
		if(prevAggregate != this.props.aggregate)
		{
			calculateData(this.props.aggregate);
			prevAggregate = this.props.aggregate;
		}
		else if(this.props.aggregate == 0)
		{
			calculateData(0);
		}
		//calculateData(this.props.sentiment_value);
		var w = window.innerWidth;
		return(
			<div id="graph-realtime-container" className="hidden" style={{height: "320px"}}>
				<canvas id="graph-realtime" height="320" width={w} ref="graph">
				</canvas>
			</div>
		);
	}
});


function calculateData(sentiment_value) {
	var average_value = findPreviousAverage(sentiment_value);
 	sendDataToGraph(sentiment_value, average_value);
}

function findPreviousAverage(sentiment_value) {
	// Add the new sentiment value to array and 
	// keep last 5 values. This gives us an average
	// sentiment instead of raw real time.
	average_array.push(sentiment_value);
	average_array= average_array.splice(-5);

	// Calculate the average of the array with new
	// sentiment value.
	var total = 0;
	for (var item in average_array) {
		total += parseFloat(average_array[item]);
	}
	return total/average_array.length;
}

function sendDataToGraph(sentiment_value, average_value) {
	console.log(average_value);
	console.log(average_array)
	real_time.append(new Date().getTime(), sentiment_value);
 	avg_time.append(new Date().getTime(), average_value);
}

module.exports = GraphRealtime;
