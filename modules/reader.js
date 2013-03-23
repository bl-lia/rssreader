var feedparser = require('feedparser')
    , mongoose = require('mongoose')
    , schema   = require('./schema');
    
mongoose.connect('mongodb://localhost/rssreader');

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
        callback(feeds);
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
                    if(err) console.error(err);
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
        
        a.save();
    });
};

Reader.getFeedArticles = function(feedId, callback){
    console.log('reader.js:Reader.getFeedArticles:feedId=%s', feedId);
    var Article = mongoose.model('Article');
    Article.find({feedId: new mongoose.Types.ObjectId(feedId)}, callback);
};

Reader.getNewArticles = function(url, callback){
    feedparser.parseUrl(url,
        function(error, meta, articles){
            if(error) console.error(error);
            else callback(articles);
        });
};



exports = module.exports = Reader;