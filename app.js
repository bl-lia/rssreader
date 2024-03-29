
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
app.get('/reader/:name', reader.callApi);
app.get('/sandbox', reader.sandbox);

//http.createServer(app).listen(app.get('port'), function(){
//  console.log("Express server listening on port " + app.get('port'));
//});

var s = socketio.listen(app.listen(app.get('port')), function(){
    console.log("Express server listening on port " + app.get('port') + " with socket.io");
});

s.sockets.on('connection', function(socket){
    
    socket.on('ping server', function(){
        console.log('Call ping server');
        socket.emit('ping server done', {result: 'success'});
    });
    
    socket.on('error', function(){
        console.error('error error error');
    });
    
    socket.on('load feeds', function(){
        console.log('Call load feeds');
        events.loadFeeds(function(feeds){
           socket.emit('load feeds done', {feeds: feeds}); 
        });
    });
    
    socket.on('load tags', function(){
        console.log('Call load tags');
        events.loadTags(function(tags){
            socket.emit('load tags done', {tags: tags});
        });
    });
    
    socket.on('load feed articles', function(data){
        console.log('Call load feed articles. feedId:%s', data.feed._id);
        events.loadFeedArticles(data.feed._id, function(articles){
            socket.emit('load feed articles done', {feed: data.feed, articles: articles});
        });
    });
    
    socket.on('add tag', function(tag){
        console.log('Call add tag. tagname:%s', tag.name);
        events.addTag(tag.name, function(tag){
            socket.emit('add tag done', {tag: tag});
        });
    });
    
    socket.on('add feed', function(data){
        console.log('Call add feed. url:%s', data.url);
        events.addFeed(data.url, function(feed){
            socket.emit('add feed done', {feed: feed});
        });
    });
    
    socket.on('refresh feed articles', function(data){
        console.log('Call refresh feed articles.');
        events.fetchArticles(data.feed._id, function(articles){
            socket.emit('refresh feed articles done', {feed: data.feed, articles: articles});
        });
    });
    
    socket.on('update feed tags', function(data){
        console.log('Call update feed tags');
        events.updateFeedTags(data.feedId, data.feedTags, function(){
            socket.emit('update feed tags done');
        });
    });
    
    socket.on('load feed tags', function(data){
        console.log('Call load feed tags');
        events.loadFeedTags(data.feedId, function(feed){
            socket.emit('load feed tags done', {feedTags: feed.feedTags});
        });
    });
    
    socket.on('load tagged articles', function(data){
        console.log('Call load tagged articles');
        events.loadTaggedArticles(data.tag._id, function(articles){
            socket.emit('load tagged articles done', {tag: data.tag, articles: articles});
        });
    });

    socket.on('refresh tagged articles', function(data){
        console.log('Call refresh tagged articles.');
        events.fetchTaggedArticles(data.tag._id, function(articles){
            socket.emit('refresh tagged articles done', {tag: data.tag, articles: articles});
        });
    });
});


