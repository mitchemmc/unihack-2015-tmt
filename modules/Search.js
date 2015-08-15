var React = require('react');
var io = require('socket.io-client')
var socket = io('http://localhost:3000');

var Search = React.createClass({
  subscribe: function(to){
    socket.emit('subscribe', to);
    console.log("subscribing to: " + to);
  },
  componentDidMount: function () {
    var key = this.props.params.key;
    console.log("mount");
    this.subscribe(key);
    this.setState({key: [this.props.params.key]});
    socket.on('tweet', function(tweet){
      console.log(tweet);
      setState(function(previousState, currentProps) {
        return {tweets: previousState.tweets.concat([tweet])};
      });
    });
  },
  getInitialState: function() {
    return {key: []};
  },
  render: function() {
    return (
      <div>Searchasdasda: {this.props.params.key}</div>
    );
  }
});

module.exports = Search;