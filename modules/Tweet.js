var React = require('react');

var Tweet = React.createClass({
  render: function() {
    return (
      <li className="tweet">
        <img className="tweet-profile" src={this.props.img_url} />
        <span className="tweet-text">
          {this.props.text}
        </span>
        <a className="tweet-time">
          {this.props.time}
        </a>
      </li>
    );
  }
});

module.exports = Tweet;