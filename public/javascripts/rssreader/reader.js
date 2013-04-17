enyo.kind({
    name: "App",
    components: [
        {name: "rootPanel", kind: "reader.fragment.RootPanel"}
    ],
    setFeed: function(feed){
        this.$.rootPanel.setFeed(feed);
    },
    setFeedTag: function(tag){
        this.$.rootPanel.setFeedTag(tag);
    },
    refreshFeeds: function(feeds){
        this.$.rootPanel.refreshFeeds(feeds);
    },
    refreshTags: function(tags){
        this.$.rootPanel.refreshTags(tags);
    },
    refreshArticle: function(article){
        this.$.rootPanel.refreshArticle(article);
    },
    refreshFeedSelectedTags: function(tags){
        this.$.rootPanel.refreshFeedSelectedTags(tags);
    },
    refreshTagArticles: function(tag, articles){
        this.$.rootPanel.refreshArticle(articles);
    }
});

enyo.kind({
    name: "reader.fragment.RootPanel",
    kind: "Panels",
    fit: true,
    classes: "panels enyo-fit app-panels",
    arrangerKind: "CollapsingArranger",
    components: [
        {name: "navPanel", kind: "reader.fragment.NavPanel", onShowArticlePanel: "showArticlePanel"},
        {name: "contentPanel", kind: "reader.fragment.MainPanel", classes: "panels enyo-fit panel-main"}
    ],
    setFeed: function(feed){
        this.$.contentPanel.setFeed(feed);
    },
    setFeedTag: function(tag){
        this.$.contentPanel.setFeedTag(tag);
    },
    refreshFeeds: function(feeds){
        this.$.navPanel.refreshFeeds(feeds);
    },
    refreshTags: function(tags){
        this.$.navPanel.refreshTags(tags);
        this.$.contentPanel.refreshTags(tags);
    },
    refreshArticle: function(article){
        this.$.contentPanel.refreshArticle(article);
        
        if(enyo.Panels.isScreenNarrow()){
            this.next();
        }
    },
    refreshFeedSelectedTags: function(tags){
        this.$.contentPanel.refreshFeedSelectedTags(tags);
    },
    showArticlePanel: function(){
        this.next();
    }
});
