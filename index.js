var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var Twitter = require('node-tweet-stream');

var rooms = [];
var waitingForRespose = false;

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

  socket.on('request room data', function(){
  	socket.subscriptions.forEach(function(sub){
  		rooms.forEach(function(room){
  			if(sub == room.room)
  			{
  				socket.emit('recieve room data', room.sentiment_queue);
  			}
  		});
  	});
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
		var reg = new RegExp(d.room, "gi");
		if(reg.test(tweet.text))
		{
			io.to(d.room).emit('tweet', tweet);
			console.log("sending tweet to: " + d.room);
			updateSentimentText(d, tweet);
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
	rooms.push({room: room, subscribers: 1, sentiment_string: "", data:{positive: 0, negative: 0, neutral: 0}, sentiment_queue: []});
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

setInterval(function(){
	if(rooms.length > 0)
	{

		var sentiment_data = rooms.map(function(room){
			var text = "-";
			if(room.sentiment_string != "")
				text = room.sentiment_string;

			return {name: "analyzesentiment", params: {text: text}, version: "v1"};
		});
		console.log(sentiment_data);
		rooms.forEach(function(room){
			room.sentiment_string = "";
		});

		runSentiment(sentiment_data, function(data){
			//console.log(data.actions);
			if(data)
			{
				data.actions.forEach(function(action, index){
					if(typeof action.result != 'undefined')
					{	
						var sentiments = [];
						var influentialSentiment;
						//increment rooms data
						action.result.positive.forEach(function(el){
							rooms[index].data.positive++;
							sentiments.push({sentiment: el.sentiment, score: el.score});
						});
						action.result.negative.forEach(function(el){
							rooms[index].data.negative++;
							sentiments.push({sentiment: el.sentiment, score: el.score});
						});
						if(action.result.positive.length == 0 && action.result.negative ==0)
						{
							rooms[index].data.neutral++;
							influentialSentiment = {sentiment: "", sentiment_score: 0};
						}
						else if (sentiments.length > 0)
						{
							influentialSentiment = sentiments.reduce(function(a, b){
								if(Math.abs(a.score) > Math.abs(b.score))
									return a;
								else
									return b;
							});
						}
						var time = formatDate(new Date());
						rooms[index].sentiment_queue.push({aggregate: action.result.aggregate.score, time: time});
						rooms[index].sentiment_queue.splice(-180);

						io.to(rooms[index].room).emit('analysis', {aggregate: action.result.aggregate.score, sentiment: influentialSentiment.sentiment, sentiment_score: influentialSentiment.score, room_data: rooms[index].data});
						console.log(rooms[index].room + " : " + action.result.aggregate.score)
					}
				});
			
			}
		});
	}
}, 10000);

function runSentiment(data, callback){
	waitingForRespose = true;
	var job = JSON.stringify({"actions": data});
	var apikey = '8f57ab14-d809-45bb-b4ee-48bf9e8fe676';
	request({
	    url: 'http://api.idolondemand.com/1/job/', //URL to hit
	    method: 'POST',
	    form: {
	        'apikey': apikey,
	        'job': job
	    },
	}, function(error, response, body){
	    if(error) {
	        console.log(error);
	    } else {
	        var jobID = JSON.parse(body).jobID;
	        request({
	        	url: 'http://api.idolondemand.com/1/job/status/' + jobID + "?apikey=" + apikey

	        }, function(e, r, b){
	        	if (r.statusCode >= 200 && r.statusCode < 400)
	        	{
	        		callback(JSON.parse(b));
	        		//console.log(b);
	        	}
	        	 else {
	        	 	console.log("error: ");
	        	 	console.log(r);
	        	}
	        	waitingForRespose = false;
	        });
	    }
	});
};

var urlReg = new RegExp("(https?|ftp):\/\/[^\s\/$.?#].[^\s]*|[@#]", 'gi');

function updateSentimentText(room, tweet){
	if(typeof tweet.retweeted_status == 'undefined' && tweet.lang == "en" && !waitingForRespose)
	{
		var parsed = tweet.text.replace(urlReg, "");
		room.sentiment_string += parsed + " ";
	}
}

function formatDate(date_object) {
	return date_object.getHours() + ":" + date_object.getMinutes() + ":" + date_object.getSeconds();
}
