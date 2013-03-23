var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;
  
var Article = new Schema({
    _id:            Schema.Types.ObjectId,
    feedId:         Schema.Types.ObjectId,
    date:           Date,
    title:          String,
    description:    String,
    summary:        String,
    link:           String
});

var Feed = new Schema({
    _id:        Schema.Types.ObjectId,
    name:       String,
    link:       String,
    xmlUrl:     String
});

mongoose.model('Feed', Feed);
mongoose.model('Article', Article);