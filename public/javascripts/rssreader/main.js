enyo.kind({
    name: "reader.fragment.MainPanel",
    kind: "Panels",
    classes: "panels enyo-fit",
    components: [{
        kind: "FittableRows",
        components: [
            {
                kind: "Panels",
                name: "articlePanel",
                classes: "panels article-panel",
                arrangerKind: "CardSlideInArranger",
                fit: true,
                components: [
                    {kind: "Scroller", name: "scroller", strategyKind: "TouchScrollStrategy", components: [
                        {kind: "reader.fragment.Articles", name: "articles"}
                    ]},
                    {kind: "Scroller", components:[
                        {content: "aaaa"}
                    ]}
                ]
            },
            {kind: "reader.fragment.ArticleToolbar", name: "articleBar", onShowTagPanel: "showTagPanel"},
        ]
    }],
    showTagPanel: function(){
        console.log("bbbb");
        if(this.$.articlePanel.index == 0)
            this.$.articlePanel.next();
        else
            this.$.articlePanel.previous();
    },
    setFeed: function(feed){
        this.$.articleBar.setFeed(feed);
    },
    refreshArticle: function(article){
        this.$.articles.refreshItem(article);
    }
});

enyo.kind({
    name: "reader.fragment.Articles",
    components: [
        {
            name: "list",
            kind: "List",
            classes: "list-articles-list",
            count: 0,
            onSetupItem: "setupItem",
            multiSelect: true,
            fit: true,
            components: [
                {kind: "reader.fragment.Article", name: "article", ontap: "itemTap"},
            ]
        }
    ],
    articles: [],
    setupItem: function(inSender, inEvent){
        var i = inEvent.index;
        
        this.$.article.setArticle(this.articles[i]);
        this.$.article.setSelected(inSender.isSelected(i));
    },
    itemTap: function(inSender, inEvent){
    },
    refreshItem: function(data){
        this.articles = data;
        this.$.list.setCount(this.articles.length);
        this.$.list.refresh();
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
