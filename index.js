var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twitter = require('node-tweet-stream')

app.get(/^((?!js).)*$/, function(req, res){
  res.sendfile('index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var t = new Twitter({
	consumer_key: '3fSzmIdsWBqgwQnXHkeOd6V1s',
    consumer_secret: 'NUoTOaJyRb9GjnXODHknRJQ5jMC8uSfbGS011ZEbwcCDBsx7vk',
    token: '594938753-m8zspBjpGa0wVrvTKb0snfubGQ32uAvlraJzuEjE',
    token_secret: 'Zi6aewjeiclVfhvGzMZa4WWJHLGNiabsojRpKDi8kL6Dl'
  });
 
t.on('tweet', function (tweet) {
  io.emit('tweet', tweet);
});
 
t.on('error', function (err) {
  console.log('Oh no');
});
 
t.track('pizza');