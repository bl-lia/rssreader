var reader = require('./reader');

function Events(){}

Events.loadFeeds = function(callback){
    console.log('Call Events.loadFeeds');
    reader.load(function(feeds){
        callback(feeds);
    });
};

Events.loadFeedArticles = function(feedId, callback){
    reader.getFeedArticles(feedId, function(err, articles){
       callback(articles); 
    });
};

Events.addFeed = function(url, callback){
    reader.addFeed(url, function(feed, articles){
        reader.addArticles(feed, articles);
        callback(feed);
    });
};

exports = module.exports = Events;