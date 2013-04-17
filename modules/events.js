var reader = require('./reader')
   ,moment = require('moment')
   ,async  = require('async');

function Events(){}

Events.loadFeeds = function(callback){
    console.log('Call Events.loadFeeds');
    reader.load(function(feeds){
        callback(feeds);
    });
};

Events.loadTags = function(callback){
    console.log('/modules/events.js:Call Events.loadTags');
    reader.loadTags(function(tags){
        if(callback !== undefined) callback(tags);
    });
};

Events.loadFeedTags = function(feedId, callback){
    console.log('/modules/events.js:Call Events.loadFeedTags');
    reader.loadFeedTags(feedId, callback);
};

Events.loadFeedArticles = function(feedId, callback){
    reader.getFeedArticles(feedId, 30, function(err, articles){
       callback(articles);
    });
};

Events.fetchArticles = function(feedId, callback){
    var arr = new Array();
    reader.getNewArticles(feedId, function(err, meta, articles, feed){
        reader.getFeedArticles(feedId, articles.length, function(err, old){
            articles.forEach(function(article){
                var isSame = false;
                for(var i=0; i<old.length; i++){
                    var o = old[i];
                    if(moment(article.date).diff(moment(o.date)) === 0){
                        isSame = true;
                        break;
                    }
                }
                if(!isSame){
                    arr.push(article);
                }
            });
            
            reader.addArticles(feed, arr, function(){
                reader.getFeedArticles(feedId, 30, function(err, articles){
                    callback(articles);
                });
            });
        });
    });
};

Events.fetchTaggedArticles = function(tagId, callback){
    console.log('/modules/events.js:Call Events.fetchTaggedArticles');
    reader.getTaggedFeeds(tagId, function(feeds){
        async.each(feeds,
                    function(feed){
                        console.log(feed);
                        Events.fetchArticles(feed._id.toString());
                    },
                    function(err){
                        Events.loadTaggedArticles(tagId, callback);
                    });
    });
};

Events.addTag = function(tagname, callback){
    reader.addTag(tagname, function(tag){
        if(callback !== undefined)
            callback(tag);
    });
};

Events.addFeed = function(url, callback){
    reader.addFeed(url, function(feed, articles){
        reader.addArticles(feed, articles);
        callback(feed);
    });
};

Events.updateFeedTags = function(feedId, feedTags, callback){
    console.log('/modules/events.js:Call Events.updateFeedTags');
    reader.updateFeedTags(feedId, feedTags, callback);
};

Events.loadTaggedArticles = function(tagId, callback){
    console.log('/modules/events.js:Call Events.loadTaggedArticles');
    reader.getTaggedFeeds(tagId, function(feeds){
        var feedIds = new Array();
        for(var i=0; i<feeds.length; i++){
            feedIds.push(feeds[i]._id);
        }
        reader.getFeedsArticles(feedIds, 30, callback);
    });
};

exports = module.exports = Events;