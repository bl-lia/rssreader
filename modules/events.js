var reader = require('./reader');

function Events(){}

Events.loadFeeds = function(callback){
    console.log('Call Events.loadFeeds');
    reader.load(function(feeds){
        callback(feeds);
    });
};

Events.loadFeedArticles = function(url, callback){
    reader.getFeedArticles(url, function(articles){
       callback(articles); 
    });
};

Events.addFeed = function(url, callback){
    reader.addFeed(url, function(feed){
        callback(feed);
    });
};

exports = module.exports = Events;