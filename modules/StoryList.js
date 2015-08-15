var React = require('react');
var Story = require('./Story');

var StoryList = React.createClass({
	render: function(){
		var stories = this.props.stories.map(function(story, i){
			return (
				<Story title = {story.title} imgUrl = {story.imgUrl} author = {story.author} date = {story.date} link = {story.link} key={i}/>
			)
		})
		return(
			<ul className = "story-list">
				{stories}
			</ul>
		);
	}
});

module.exports = StoryList;