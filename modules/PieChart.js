var React = require('react');
var c3 = require('c3');
require('./c3.css');
var oldProps = -1;

var c3data = { bindto: '#pie-chart',
				data: {
			        columns: [
			            ['positive', 0],
			            ['negative', 0],
			            ['neutral', 0]
			        ],
			        type: 'pie',
			        // Set the colors of the pie chart
			        colors: {positive: "#c4e0a4", negative: "#e47272", neutral: "#ced7db"}
			    }

			    
			};

var PieChart = React.createClass({
	_renderChart: function () {
    },
    componentDidMount: function () {
        //this._renderChart();
        this.chart = c3.generate(c3data);

        //this._renderChart({'5:2:42': 0.06722221709787846, '5:2:43': -0.8602521014399827});
    },

    componentWillReceiveProps: function (newProps) {
    	var sum = newProps.positive + newProps.negative + newProps.neutral;
    	if(sum > oldProps)
    	{
	    	console.log(sum);
	        this.chart.load({columns: [
						['positive', newProps.positive],
				        ['negative', newProps.negative],
				        ['neutral', newProps.neutral]
					]});
	        oldProps = sum;
	    }	
    },
    
	render: function(){
		return <div id="pie-chart"/>
	}

});

module.exports = PieChart;
