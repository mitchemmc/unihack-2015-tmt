/** @jsx React.DOM */

var App = require('./App');
var Home = require('./Home');
var About = require('./About');
var Search = require('./Search');
var React = require('react');
var Router = require('react-router');
var {DefaultRoute, Route, Routes} = Router;

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="about" handler={About} />
    <DefaultRoute name="home" handler={Home} />
    <Route name="search" path="search=:key" handler={Search} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler/>, document.body);
});