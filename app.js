
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , reader = require('./routes/reader')
  , socketio = require('socket.io')
  , events = require('./modules/events');

var app = express();

app.configure(function(){
  app.set('port', 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/reader', reader.index);

//http.createServer(app).listen(app.get('port'), function(){
//  console.log("Express server listening on port " + app.get('port'));
//});

socketio.listen(app.listen(app.get('port')), function(){
    console.log("Express server listening on port " + app.get('port') + " with socket.io");
}).sockets.on('connection', function(socket){
    socket.on('load feeds', function(){
        console.log('Call load feeds');
        events.loadFeeds(function(feeds){
           socket.emit('load feeds done', {feeds: feeds}); 
        });
    });
    
    socket.on('load feed articles', function(data){
        console.log('Call load feed articles');
        events.loadFeedArticles(data.url, function(articles){
            socket.emit('load feed articles done', {articles: articles});
        });
    });
    
    socket.on('add feed', function(data){
        console.log('Call add feed');
        events.addFeed(data.url, function(feed){
            socket.emit('add feed done', {feed: feed});
        });
    });
});


