var React = require('react');

var SentimentListItem = React.createClass({
  render: function() {
  	var color = this.props.score > 0 ? '#c4e0a4' : '#e47272';
    return (
      <li className="sentiment-list-item" style={{background: color}}>
      	<h3>{this.props.sentiment}-</h3><span> {this.props.score.toFixed(2)}</span>
      </li>
    );
  }
});

module.exports = SentimentListItem;