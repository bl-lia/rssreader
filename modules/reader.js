var feedparser = require('feedparser')
    , mongoose = require('mongoose')
    , schema   = require('./schema');
    
mongoose.connect('mongodb://localhost/rssreader');
mongoose.connection.on('error', function(err){
    console.error('error occurred');
    throw err;
});

function Reader(){
}

Reader.test = function(){
  console.log('aaa');  
};

Reader.read = function(){
    feedparser.parseUrl('feeds.gawker.com/gizmodo/full',
        function(error, meta, articles){
            if(error) console.error(error);
            else{
                console.log('%s - %s - %s', meta.title, meta.link, meta.xmlUrl);
                articles.forEach(function(article){
                    console.log("%s - %s(%s)", article.date, article.title, article.link);
                });
            }
        });
};

Reader.save = function(name){
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
        var Feed = mongoose.model('Feed');
        var feed = new Feed({name: name});
        feed.save(function(){
            console.log('success');
        });
    });
};

Reader.load = function(callback){
    console.log("Call Reader.load");
    var Feed = mongoose.model('Feed');
    Feed.find(function(err, feeds){
        if(err) throw err;
        else
            callback(feeds);
    });
};

Reader.loadTags = function(callback){
    console.log('/modules/reader.js:Call Reader.loadTags');
    var Tag = mongoose.model('Tag');
    Tag.find(function(err, tags){
        if(err) throw err;
        else
            if(callback !== undefined) callback(tags);
    });
};

Reader.loadFeedTags = function(feedId, callback){
    console.log('/modules/reader.js:Call Reader.loadFeedTags');
    var Feed = mongoose.model('Feed');
    Feed.findOne({_id: new mongoose.Types.ObjectId(feedId)}, function(err, feed){
        if(err) throw err;
        else
            if(callback !== undefined) callback(feed);
    });
};

Reader.addTag = function(tagname, callback){
    console.log('reader.js:Reader.addTag');
    var Tag = mongoose.model('Tag');
    var tag = new Tag({
        name: tagname
    });
    
    tag.save(function(err, t){
        if(err) throw err;
        else{
            console.log('Success to save tag.');
            if(callback !== undefined)
                callback(t);
        }
    });
};

Reader.addFeed = function(url, callback){
    feedparser.parseUrl(url,
        function(error, meta, articles){
            if(error) console.error(error);
            else{
                var Feed = mongoose.model('Feed');
                var feed = new Feed({
                    _id: new mongoose.Types.ObjectId,
                    name: meta.title,
                    link: meta.link,
                    xmlUrl: meta.xmlUrl !== null ? meta.xmlUrl : url
                });
                
                console.log('Add feed. %s - %s - %s', meta.title, meta.link, meta.xmlUrl);
                
                feed.save(function(err, f){
                    if(err) throw err;
                    else{
                        console.log('Success to save feed.');
                        callback(f, articles);
                    }
                });
            }
        });
};

Reader.addArticles = function(feed, articles, callback){
    console.log('reader.js:Reader.addArticles:');
    console.log('articles.length:%s', articles.length);
    var arr = new Array();
    var endCount = 0;
    articles.forEach(function(article){
        var Article = mongoose.model('Article');
        var a = new Article({
            feedId:         feed._id,
            date:           article.date,
            title:          article.title,
            description:    article.description,
            summary:        article.summary,
            link:           article.link
        });
        
        a.save(function(err, a){
            if(err) throw err;
            else{
                arr.push(a);
                endCount++;
                if(endCount == articles.length)
                    if(callback !== undefined)
                        callback(arr);
            }
        });
    });
};

Reader.getFeedArticles = function(feedId, limit, callback){
    console.log('reader.js:Reader.getFeedArticles:feedId=%s', feedId);
    if('number' != typeof limit){
        limit = 30;
    }
    var Article = mongoose.model('Article');
    Article.find({feedId: new mongoose.Types.ObjectId(feedId)})
            .sort({date: 'desc'})
            .limit(limit)
            .exec(callback);
};

Reader.getFeedsArticles = function(feedIds, limit, callback){
    console.log('reader.js:Reader.getFeedArticles:feedIds=%s', feedIds);
    if('number' != typeof limit){
        limit = 30;
    }
    
    var arr = new Array();
    for(var i=0; i<feedIds.length; i++){
        arr.push(feedIds[i]);
    }
    
    var Article = mongoose.model('Article');
    Article.find({feedId: {$in: arr} })
            .sort({date: 'desc'})
            .limit(limit)
            .exec(function(err, articles){
                if(err) throw err;
                else
                    if(callback !== undefined) callback(articles);
            });
};

Reader.getNewArticles = function(feedId, callback){
    var Feed = mongoose.model('Feed');
    Feed.findById(new mongoose.Types.ObjectId(feedId), function(err, feed){
        if(err) throw err;
        else{
            if(feed.xmlUrl !== null)
                feedparser.parseUrl(feed.xmlUrl, function(err, meta, articles){
                    callback(err, meta, articles, feed);
                });
        }
    });
};

Reader.updateFeedTags = function(feedId, feedTags, callback){
    var tags = new Array();
    for(var i=0; i<feedTags.length; i++){
        var t = feedTags[i];
        tags.push(t._id);
    }
    var Feed = mongoose.model('Feed');
    Feed.update(
        {_id: new mongoose.Types.ObjectId(feedId)},
        {feedTags: tags},
        {safe: true},
        function(err, numberAffected, raw){
            if(err) throw err;
            else
               if(callback !== undefined) callback();
        });
};

Reader.getTaggedFeeds = function(tagId, callback){
    var Feed = mongoose.model('Feed');
    Feed.find({feedTags: {$in: [new mongoose.Types.ObjectId(tagId)]}}, function(err, feeds){
        if(err) throw err;
        else
            if(callback !== undefined) callback(feeds);
    });
};

exports = module.exports = Reader;