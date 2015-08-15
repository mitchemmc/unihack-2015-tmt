var React = require('react');
var io = require('socket.io-client')
var socket = io('http://localhost:3000');
var TweetStream = require('./TweetStream');
var StoryList = require('./StoryList');
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

    //Setup tweet stream
    socket.on('tweet', function(tweet){
      console.log(tweet);
      self.setState(function(previousState, currentProps) {
        var tweetToAdd = {text: tweet.text, created_at: tweet.created_at, time: "now", img_url: tweet.user.profile_image_url}
        return {tweets: [tweetToAdd].concat(previousState.tweets)};
      });
    });

    //update times every minute
   /* setInterval(function(){
      self.setState(function(previousState, currentProps) {
        var updatedState = previousState.tweets.map(function(t){
          var time = pretty(t.created_at);
          return {text: t.text, created_at: tweet.created_at, time: time}
        });
        return {tweets: updatedState};
      });
    }, 60000);*/

    getNewsFeed(key, function(stories){self.setState({stories: stories})});

    socket.on('analysis', function(score){
      console.log(score);
    })
  },
  getInitialState: function() {
    return {key: [], tweets: [], stories: []};
  },
  //        <div>Search: {this.props.params.key}</div>

  render: function() {
    return (

      <div className="layout-collumn layout">
        <TweetStream tweets={this.state.tweets}/>
        <StoryList stories={this.state.stories}/>
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