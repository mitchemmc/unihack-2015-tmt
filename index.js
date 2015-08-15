var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twitter = require('node-tweet-stream');

var rooms = [];

app.get(/^((?!js).)*$/, function(req, res){
  res.sendfile('index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.subscriptions = [];

  socket.on('subscribe', function(room){
  	subscribe(room);
  	socket.subscriptions.push(room);
  	socket.join(room);
  });

  socket.on('disconnect', function(){
  	console.log('disconnect');
  	console.log(socket.subscriptions);
  	socket.subscriptions.forEach(function(room){
  		unsubscribe(room);
  		socket.leave(room);
  	});
  	socket.subscriptions = [];
  });
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
	rooms.forEach(function(d){
		var reg = new RegExp(d.room);
		if(reg.test(tweet.text))
		{
			io.to(d.room).emit('tweet', tweet);
			console.log("sending tweet to: " + d.room);
		}
	});
});
 
t.on('error', function (err) {
  console.log('Oh no');
});

function track(room){
	t.track(room);
	console.log("tracking: " + room);
};

function untrack(room){
	t.untrack(room);
	console.log("untracking: " + room);
}

function subscribe(room){
	var doesExsist = false;
	rooms.forEach(function(d){
		if(d.room == room)
			doesExsist = true;
	});

	if(doesExsist)
		incrementSubscribers(room);
	else
		addRoom(room);

}

function unsubscribe(room){
	console.log("unsubscribing from: " + room);
	rooms.forEach(function(d){
		if(d.room == room)
		{
			d.subscribers--;
			if(d.subscribers < 1)
			{
				destroyRoom(d);
			}
		}
	});
}

function addRoom(room){
	rooms.push({room: room, subscribers: 1, sentiment_string: ""});
	console.log("adding room: " + room);
	track(room);
}

function destroyRoom(room){
	rooms.splice(rooms.indexOf(room));
	console.log("Destroying room: " + room.room);
	untrack(room.room);
}

function incrementSubscribers(room){
	rooms.forEach(function(d){
		if(d.room == room)
			d.subscribers++;
	});
}