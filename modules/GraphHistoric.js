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
            			Historical: '#ff0000'
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

			/*
			var test_data = new Object();

			setInterval(function () {
				var timer = new Date();
				var sentiment = Math.random()*2 - 1;
				test_data[formatDate(timer)] = sentiment;
				console.log(test_data);
				loadHistoric(test_data);
			}, 1000);*/

			// Call loadHistoric on {"H:M:S": sentiment, "H:M:S": sentiment}
			// This will add to graph

			/*function formatDate(date_object) {
				return date_object.getHours() + ":" + date_object.getMinutes() + ":" + date_object.getSeconds();
			}*/
			
			/*function parseColumns(data) {
				var x_col = ['x'];
				var data_col = ['data1'];
				for (var time in data) {
					x_col.push(time);
					data_col.push(data[time]);
				}
				return {"x_col": x_col, "data_col": data_col};
			}*/

			/*function loadHistoric(history_data) {
				var parsedCols = parseColumns(history_data);
			    chart.load({
			        columns: [
			            parsedCols.x_col,
			            parsedCols.data_col,
			        ]
			    });
			}*/

module.exports = GraphHistoric;
