var React = require('react');
var io = require('socket.io-client')
var socket = io('http://localhost:3000');
var TweetStream = require('./TweetStream');
var StoryList = require('./StoryList');
var GraphRealtime = require('./GraphRealtime');
var GraphHistoric = require('./GraphHistoric');
var Button = require('./Button');
var PieChart = require('./PieChart');
var $ = require('jquery');

var Search = React.createClass({
  subscribe: function(to){
    socket.emit('subscribe', to);
    console.log("subscribing to: " + to);
  },

  componentDidMount: function () {
    var self = this;
    var key = this.props.params.key;
    console.log("mount");
    this.subscribe(key);
    this.setState({key: [this.props.params.key]});
    var tweetQueue = [];
    //Setup tweet stream
    socket.on('tweet', function(tweet){
      //console.log(tweet);
      tweetQueue.push(tweet);
      
    });

    setInterval(function(){
      if(tweetQueue.length > 0)
      {
        var tweet = tweetQueue.reduce(function(a, b){
            if(a.user.followers_count > b.user.followers_count)
              return a;
            else
              return b;
          });
        self.setState(function(previousState, currentProps) {
          var tweetToAdd = {text: tweet.text, created_at: tweet.created_at, time: "now", img_url: tweet.user.profile_image_url}
          return {tweets: [tweetToAdd].concat(previousState.tweets)};
        });
        tweetQueue = [];
      }
    },2000);

    //update times every minute
    setInterval(function(){
      self.setState(function(previousState, currentProps) {
        var updatedState = previousState.tweets.map(function(t){
          var time = pretty(t.created_at);
          return {text: t.text, created_at: t.created_at, time: time}
        });
        return {tweets: updatedState};
      });
    }, 60000);

    getNewsFeed(key, function(stories){self.setState({stories: stories})});

    socket.on('analysis', function(data){
      console.log("sentiment: ");
      console.log(data);
      var sentiment_queue_times = [];
      var sentiment_queue_scores = [];
      data.sentiment_queue.forEach(function(element){
        sentiment_queue_times.push(element.time);
        sentiment_queue_scores.push(element.aggregate);
      });
      self.setState({aggregate: data.aggregate, sentiment_queue_times: sentiment_queue_times, sentiment_queue_scores: sentiment_queue_scores, room_data: data.room_data})
    })
  },
  getInitialState: function() {
    return {key: [], tweets: [], stories: [], aggregate: 0, sentiment_queue_times: [], sentiment_queue_scores: [], graph_switch_state: "Realtime", room_data: {positive: 0, negative: 0, neutral: 0}};
  },
  //        <div>Search: {this.props.params.key}</div>
//          <GraphRealtime aggregate={this.state.aggregate}/>
  _handleGraphSwitchClick: function(){
    if(this.state.graph_switch_state == "Historic")
    {
      this.setState({graph_switch_state: "Realtime"});
      document.querySelector('#historic-chart').className = "c3";
      document.querySelector('#graph-realtime-container').className = "hidden";
    }
    else
    {
      this.setState({graph_switch_state: "Historic"});
      document.querySelector('#historic-chart').className = "c3 hidden";
      document.querySelector('#graph-realtime-container').className = "";
    }
  },

  render: function() {
    return (

      <div className="layout">
        <div className="layout-collumn layout">
          <TweetStream tweets={this.state.tweets}/>
          <StoryList stories={this.state.stories}/>
        </div>
        <div className="layout-row">
          <Button class="graph-real-hist" click={this._handleGraphSwitchClick} text={this.state.graph_switch_state} />
          <GraphHistoric times={this.state.sentiment_queue_times} values={this.state.sentiment_queue_scores} ref="graphHistoric"/>
          <GraphRealtime aggregate={this.state.aggregate} ref="grpahRealtime"/>
        </div>
        <div className="layout-collumn">
          <PieChart positive={this.state.room_data.positive} negative={this.state.room_data.negative} neutral={this.state.room_data.neutral} />
        </div>
      </div>

    );
  }
});

// from ejohn.org/blog/javascript-pretty-date/
function pretty(time){
  var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
  diff = (((new Date()).getTime() - date.getTime()) / 1000),
  day_diff = Math.floor(diff / 86400);
  if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 ) return;
  return day_diff == 0 && (
    diff < 60 && "now" ||
    diff < 120 && "1m" ||
    diff < 3600 && Math.floor( diff / 60 ) + "m" ||
    diff < 7200 && "1h" ||
    diff < 86400 && Math.floor( diff / 3600 ) + "h") ||
  day_diff == 1 && "1d" ||
  day_diff < 7 && day_diff + "d" ||
  day_diff < 31 && Math.ceil( day_diff / 7 ) + "w";
}

function getNewsFeed(query, callback){
    $.ajax({
      url:  '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent('http://news.google.com/news?q=' + query + '&output=rss'),
      dataType: 'json',
      success: function(data){
        var stories = [];
        if(data.responseData.feed && data.responseData.feed.entries){
          $.each(data.responseData.feed.entries, function(i, e){
            //Get title for each object
            var authorArray = e.title.split(" - ");
            var author = authorArray[authorArray.length - 1];
            var title = "";
            for(var i = 0; i < authorArray.length - 1; i++){
              title += authorArray[i] + " - ";
            }
            title = title.substring(0, title.length - 3);

            //Get formatted date
            var monthNames = [
                      "January", "February", "March",
                      "April", "May", "June", "July",
                      "August", "September", "October",
                      "November", "December"
                  ];
                  var date = new Date(e.publishedDate);
                  var day = date.getDate();
                  var monthIndex = date.getMonth();
                  var year = date.getFullYear();
                  var datePublished = day + " " + monthNames[monthIndex] + " " + year;

                  //Get picture url
                  var pic = $(e.content)[0];
                  var url = $(pic).find("img")[0];
                  var imgUrl = "";

                  if(url.src === ''){
                    imgUrl = "no-image.png";
                  } else{
                    imgUrl = url.src;
                  }

            var story = {title: title, author: author, date: datePublished, imgUrl: imgUrl, link: e.link};
            stories.push(story);
          });
          callback(stories);
        }
      }
    });
}




module.exports = Search;