/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var {Link, RouteHandler} = require('react-router');

require('./App.css');

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  search: function(e){
    e.preventDefault();
    var query = React.findDOMNode(this.refs.input).value;
    console.log(query);
    //window.location.replace = '/search=';
    console.log(this);
    //this.transitionTo('search');
    this.context.router.transitionTo('search', {key: query});
    React.findDOMNode(this.refs.input).value = '';

  },
  render: function() {
    return (
      <div>
        <header>
          <ul>
            <li className="home"><Link to="home"><img className="logo" src="logo.png"/></Link></li>
            <li>
              <form className = "enterForm" onSubmit = {this.search}>
                <input ref = "input" placeholder="Search topic"/>
              </form>
            </li>
          </ul>
          
        </header>

        <RouteHandler />
      </div>
    );
  }
});

module.exports = App;
