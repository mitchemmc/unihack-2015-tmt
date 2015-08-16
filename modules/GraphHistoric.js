//require('./GraphHistoric.css');
var React = require('react');
var c3 = require('c3');
require('./c3.css');

var GraphHistoric = React.createClass({
	_renderChart: function () {
        // save reference to our chart to the instance
        this.chart = c3.generate(c3data);
    },
    componentDidMount: function () {
        this._renderChart();
        //this._renderChart({'5:2:42': 0.06722221709787846, '5:2:43': -0.8602521014399827});
    },

    componentWillReceiveProps: function (newProps) {
    	console.log(newProps);
        this.chart.load({
            columns: [['x'].concat(this.props.times),
            		 ['data1'].concat(this.props.values)]
        }); // or whatever API you need
    },
    
	render: function(){
		//['x'].concat(this.props.times)
		//['data1'].concat(datathis.props.values)
		return <div id="historic-chart"/>
	}

});

var c3data = {
				bindto: '#historic-chart',
			    data: {
			        x: 'x',
					xFormat: '%H:%M:%S', // 'xFormat' can be used as custom format of 'x'
			        columns: [['x'], ['data1']],
			        names: {
            			data1: 'Name 1'
        			},
			        colors: {
            			Historical: 'black',
            			data1: 'rgba(0,0,0,.6)'
            		},

			    },
        		legend: {
    				show: false
				},
			    axis: {
			        x: {
			            type: 'timeseries',
			            tick: {
			            	count: 6,
			                format: '%H:%M:%S'
			            }
			        },
			        y: {
			            max: 1,
			            min: -1,
			            show: false
			        }
			    },
			    grid: {
			        y: {
			            lines: [
			                {value: 0, text: 'Neutral', class: 'grid_neutral'},
			                {value: 1, text: 'Positive', class: 'grid_positive'},
			                {value: -1, text: 'Negative', class: 'grid_negative'}
			            ]
			        }
			    }
			}

			

module.exports = GraphHistoric;
