React = require('react');

var Button = React.createClass({
	_handleClick: function(){
		this.props.click();
	},
	render: function(){
		return(
		      <button className={this.props.class} onClick={this._handleClick}>{this.props.text}</button>
		);
	}
});

module.exports = Button;