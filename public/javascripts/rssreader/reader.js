enyo.kind({
    name: "App",
    components: [
        {name: "rootPanel", kind: "reader.fragment.RootPanel"}
    ],
    setFeed: function(feed){
        this.$.rootPanel.setFeed(feed);
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
    refreshFeedTags: function(tags){
        this.$.rootPanel.refreshFeedTags(tags);
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
    refreshFeeds: function(feeds){
        this.$.navPanel.refreshFeeds(feeds);
    },
    refreshTags: function(tags){
        this.$.navPanel.refreshTags(tags);
    },
    refreshArticle: function(article){
        this.$.contentPanel.refreshArticle(article);
    },
    refreshFeedTags: function(tags){
        this.$.contentPanel.refreshFeedTags(tags);
    },
    showArticlePanel: function(){
        this.next();
    }
});
