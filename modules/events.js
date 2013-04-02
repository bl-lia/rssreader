var reader = require('./reader')
   ,moment = require('moment');

function Events(){}

Events.loadFeeds = function(callback){
    console.log('Call Events.loadFeeds');
    reader.load(function(feeds){
        callback(feeds);
    });
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

exports = module.exports = Events;