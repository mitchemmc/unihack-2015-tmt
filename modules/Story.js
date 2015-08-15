var React = require('react');

var Story = React.createClass({
	render: function(){
		return(
			<li className = "story">
				<a className="story-link" target = "_blank" href = {this.props.link}>
					<img src = {this.props.imgUrl} className="story-image"/>
					<h3 className="story-heading">{this.props.title}</h3>
					<div className="story-subheading">{this.props.author}</div>
					<div className="story-subheading">{this.props.date}</div>
				</a>
			</li>
		);
	}
});

module.exports = Story;