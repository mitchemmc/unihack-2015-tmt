var React = require('react');
var socket = require('socket.io-client')('http://localhost:3000');

var Search = React.createClass({
  componentDidMount: function () {
    // from the path `/inbox/messages/:id`
    var key = this.props.params.key;
    this.setState({key: [this.props.params.key]});
    socket.on('tweet', function(tweet){
      console.log(tweet);
    });
  },
  getInitialState: function() {
    return {key: []};
  },
  render: function() {
    return (
      <div>Search: {this.props.params.key}</div>
    );
  }
});

module.exports = Search;