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
                {kind: "Scroller", name: "scroller", strategyKind: "TouchScrollStrategy", components: [
                    {name: "articles", kind: "reader.fragment.Articles"}
                ]},
                {kind: "Scroller", components:[
                    {name: "feedTags", kind: "reader.fragment.FeedTags"}
                ]}
            ]
        },
        {kind: "reader.fragment.ArticleToolbar", name: "articleBar", onShowTagPanel: "showTagPanel"},
    ],
    showTagPanel: function(){
        if(this.$.articlePanel.index === 0)
            this.$.articlePanel.next();
        else
            this.$.articlePanel.previous();
    },
    setFeed: function(feed){
        this.$.articleBar.setFeed(feed);
    },
    refreshArticle: function(article){
        if(this.$.articlePanel.index === 1)
            this.$.articlePanel.previous();
        this.$.articles.refreshItem(article);
    },
    refreshFeedTags: function(tags){
        this.$.feedTags.refreshList(tags);
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
    name: "reader.fragment.FeedTags",
    components: [
        {
            name: "list",
            kind: "List",
            classes: "list-main-tags-list",
            count: 0,
            onSetupItem: "setupItem",
            multiSelect: true,
            fit: true,
            components: [
                {name: "tag", kind: "reader.fragment.FeedTag"}
            ]
        }
    ],
    tags: [],
    setupItem: function(inSender, inEvent){
        var i = inEvent.index;
        
        this.$.tag.setTag(this.articles[i]);
    },
    refreshList: function(tags){
        this.tags = tags;
        this.$.list.setCount(this.tags.length);
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

enyo.kind({
    name: "reader.fragment.Article",
    classes: "enyo-border-box expandable list-articles-item",
    components: [
        {name: "title", classes: "list-article-title"},
        {name: "date", classes: "list-article-date"},
        {name: "content", classes: "list-article-content", components: [
            {name: "contentTitle", tag: "a", ontap: "openLink"},
            {name: "description", classes: "description", allowHtml: true}
        ]}
    ],
    article: "",
    setSelected: function(inSelected){
        this.addRemoveClass("expandable", !inSelected);
        this.addRemoveClass("expandable-selected", inSelected);
    },
    setArticle: function(article){
        this.article = article;
        
        if(Math.abs(moment(article.date).diff(moment(), "days")) > 0)
            this.$.date.setContent(moment(article.date).format("M/D"));
        else
            this.$.date.setContent(moment(article.date).format("HH:mm"));

        this.$.title.setContent(article.title);
        this.$.contentTitle.setContent(article.title);
        this.$.description.setContent(article.description);
    },
    openLink: function(inSender, inEvent){
        window.open(this.article.link);
    }
});

enyo.kind({
    name: "reader.fragment.FeedTag",
    classes: "enyo-border-box",
    components: [
        {kind: "onyx.Checkbox"},
        {name: "name"}
    ],
    tag: "",
    setName: function(name){
        this.$.name.setContent(name);
    }
});
