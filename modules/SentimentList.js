var React = require('react');
var SentimentListItem = require('./SentimentListItem');

var SentimentList = React.createClass({
  render: function() {
  	var sentiments = this.props.sentiments.map(function(el, i){
  		return (
  			<SentimentListItem sentiment={el.sentiment} score={el.sentiment_score} key={i} />
  			);
  	});
    return (
      <ul className="sentiment-list">
      	{sentiments}
      </ul>
    );
  }
});

module.exports = SentimentList;