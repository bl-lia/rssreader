var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;
  
var Feed = new Schema({
    name: String,
    link: String,
    xmlUrl: String
});

var FeedItem = new Schema({
    date:        Date,
    title:       String,
    description: String,
    summary:     String,
    link:        String
});

mongoose.model('Feed', Feed);
mongoose.model('FeedItem', FeedItem);