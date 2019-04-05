var express = require('express');
var app = express();
var jade = require('jade');
var http = require('http');
var server = http.createServer(app);
var Twit = require('twit');
var io = require('socket.io').listen(server);
var colors = [".3F602B", "#77896C", "#008B8B", "#528B8B", "#567E3A", "#55AE3A", "#458B74", "#174038", "#20BF9F", "#01C5BB", "#457371", "#78AB46", "#FF4040", "#EE5C42", "#CD3700", "#29242", "#B87333", "#8B795E"];

var keys = require('./keys');

server.listen(process.env.PORT || 3000);

app.set('view engine', 'jade');
app.use(express.static('static'));
app.use(express.bodyParser());


var index = {
    title: 'Sudan Uprising - Tweet Deck',
    listhint: '',
    paused: 'Pause',
    about: 'Created by: Steve Lacy slacy.me, Modified by @xc0d3rz',
    example: {
        name: 'ً',
        username: 'xc0d3rz',
        tweet: '#تسقط_بس',
        icon: 'https://avatars0.githubusercontent.com/u/49320717?s=200&v=4',
    }
};

app.get('/', function (req, res) {
    res.render('index', {index: index});
});


var T = new Twit({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token: keys.access_token,
    access_token_secret: keys.access_token_secret,
});


io.sockets.on('connection', function (socket) {
    console.log('Socket.io connected');

    socket.on('hash', function (hash) {
        var streamHash = hash.hash;
        var stream = T.stream('statuses/filter', {
            track: [
                '#غرد_للمليونية',
                '#موكب6ابريل',
                '#مليونية6ابريل',
            ]
        });

        stream.on('tweet', function (tweet) {
            io.sockets.emit('stream', {
                text: tweet.text,
                name: tweet.user.name,
                username: tweet.user.screen_name,
                icon: tweet.user.profile_image_url,
                users: io.sockets.manager.server.connections,
                color: colors[Math.floor(Math.random() * colors.length)],
                id: tweet.id_str
            });
        });
    });
});

 