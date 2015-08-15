var React = require('react');
var Tweet = require('./Tweet');

var TweetStream = React.createClass({
  render: function() {
  	//console.log(this.props.tweets);
  	var tweets = this.props.tweets.map(function(tweet, i){
  		return <Tweet text={tweet.text} time={tweet.time} img_url={tweet.img_url} key={i}/> 
  	});
    return (
      <ul className="tweet-stream">
      	{tweets}
      </ul>
    );
  }
});

module.exports = TweetStream;