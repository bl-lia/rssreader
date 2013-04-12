enyo.kind({
    name: "reader.fragment.MainPanel",
    kind: "FittableRows",
    components: [
        {
            kind: "Panels",
            name: "articlePanel",
            classes: "panels article-panel",
            arrangerKind: "CardSlideInArranger",
            fit: true,
            components: [
                {kind: "Scroller", strategyKind: "TouchScrollStrategy", components:[
                    {name: "articles", kind: "reader.fragment.Articles"},
                ]},
                {kind: "Scroller", strategyKind: "TouchScrollStrategy", components:[
                    {name: "feedTags", kind: "reader.fragment.FeedTags", onUpdateSelectedItem: "updateSelectedTag"}
                ]}
            ]
        },
        {kind: "reader.fragment.ArticleToolbar", name: "articleBar", onShowTagPanel: "showTagPanel"},
    ],
    feed: "",
    showTagPanel: function(){
        if(this.$.articlePanel.index === 0)
            this.$.articlePanel.next();
        else
            this.$.articlePanel.previous();
    },
    setFeed: function(feed){
        this.feed = feed;
        this.$.articleBar.setFeed(feed);
    },
    refreshArticle: function(article){
        if(this.$.articlePanel.index === 1)
            this.$.articlePanel.previous();
        this.$.articles.refreshItem(article);
    },
    refreshFeedSelectedTags: function(tags){
        this.$.feedTags.refreshFeedSelectedTags(tags);
    },
    refreshTags: function(tags){
        this.$.feedTags.refreshTags(tags);
    },
    updateSelectedTag: function(inSender, inEvent){
        socket.emit("update feed tags", {feedId: this.feed._id, feedTags: inEvent.selectedItem});
    }
});


enyo.kind({
    name: "reader.fragment.ArticleToolbar",
    kind: "onyx.Toolbar",
    classes: "toolbar",
    events: {
        onShowTagPanel:""
    },
    components: [
        {name: "name"},
        {
            name: "refreshButton",
            kind: "onyx.Button",
            content: "Refresh",
            ontap: "refreshArticles"
        },
        {
            name: "showTagsButton",
            kind: "onyx.Button",
            content: "Tags",
            ontap: "showTags"
        }
    ],
    feed: null,
    refreshArticles: function(){
        if(this.feed !== null){
            socket.emit('refresh feed articles', {feed: this.feed});
        }
    },
    setFeed: function(feed){
        this.feed = feed;
    },
    setupItem: function(inSender, inEvent){
        this.$.menuitem.setContent("aaaa");
    },
    itemSelected: function(inSender, inEvnet){
        this.$.tagMenu.destroyClientControls();
        this.$.tagMenu.createComponent({content: "ccccc"});
        this.$.tagMenu.createComponent({content: "ddddd"});
        this.render();
    },
    showTags: function(){
        console.log("aaa");
        this.doShowTagPanel();
    }
});
