var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;
  
var FeedItem = new Schema({
    date:        Date,
    title:       String,
    description: String,
    summary:     String,
    link:        String
});

var Feed = new Schema({
    name: String,
    link: String,
    xmlUrl: String,
    item: [FeedItem]
});

mongoose.model('Feed', Feed);
mongoose.model('FeedItem', FeedItem);