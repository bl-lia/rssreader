enyo.kind({
    name: "App",
    components: [
        {
            kind: "Panels",
            name: "mainPanel",
            classes: "panels enyo-fit",
            arrangerKind: "CollapsingArranger",
            components: [
                {
                    kind: "Panels",
                    name: "navPanel",
                    classes: "panels enyo-fit panel-nav",
                    components: [
                        {kind: "reader.fragment.Feeds", name: "feeds"}
                    ]
                },
                {
                    kind: "Panels",
                    name: "contentPanel",
                    classes: "panels enyo-fit",
                    components: [
                        {
                            kind: "FittableRows",
                            components: [
                                {kind: "reader.fragment.ArticleToolbar", name: "articleBar"},
                                {
                                    kind: "Panels",
                                    name: "articlePanel",
                                    classes: "panels article-panel",
                                    arrangerKind: "CardArranger",
                                    fit: true,
                                    components: [
                                        {kind: "Scroller", name: "scroller", strategyKind: "TouchScrollStrategy", components: [
                                            {kind: "reader.fragment.Articles", name: "articles"}
                                        ]},
                                        {kind: "Scroller", components:[
                                            {content: "aaaa"}
                                        ]}
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

enyo.kind({
    name: "reader.fragment.Feeds",
    components: [
        {
            kind: "reader.fragment.AddFeedBox"
        },
        {
            name: "list",
            kind: "List",
            classes: "list-feeds-list",
            count: 0,
            onSetupItem: "setupItem",
            components: [
                {
                    name: "item",
                    classes: "list-feeds-item",
                    ontap: "itemTap",
                    components: [
                        {
                            name: "name"
                        }
                    ]
                }
            ]
        }
    ],
    feeds: [],
    setupItem: function(inSender, inEvent){
        var i = inEvent.index;
        
        this.$.name.setContent(this.feeds[inEvent.index].name);
        this.$.item.addRemoveClass("list-feeds-item-selected", inSender.isSelected(i));
    },
    itemTap: function(inSender, inEvent){
        var i = inEvent.index;
        
        socket.emit('load feed articles', {feed: this.feeds[i]});
    },
    refreshList: function(data){
        this.feeds = data;
        this.$.list.setCount(this.feeds.length);
        this.$.list.refresh();
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
    name: "reader.fragment.Article",
    classes: "enyo-border-box expandable list-articles-item",
    components: [
        {name: "title", classes: "list-article-title"},
        {name: "date", classes: "list-article-date"},
        {name: "description", classes: "description", allowHtml: true}
    ],
    setSelected: function(inSelected){
        this.addRemoveClass("expandable", !inSelected);
        this.addRemoveClass("expandable-selected", inSelected);
    },
    setArticle: function(article){
        if(Math.abs(moment(article.date).diff(moment(), "days")) > 0)
            this.$.date.setContent(moment(article.date).format("M/D"));
        else
            this.$.date.setContent(moment(article.date).format("HH:mm"));

this.$.title.setContent(article.title);
        this.$.description.setContent(article.description);
    }
});

enyo.kind({
    name: "reader.fragment.AddFeedBox",
    kind: "onyx.MenuDecorator",
    components: [
        {content: "Add Feed"},
        {
            kind: "onyx.ContextualPopup",
            title: "Add Feed",
            components: [
                {name: "textArea", kind: "onyx.TextArea"},
                {kind: "onyx.Button", content: "Add", ontap: "addFeed"}
            ]
        }
    ],
    addFeed: function(inSender, inEvent){
        this.$.contextualPopup.hide();
        socket.emit('add feed', {url: this.$.textArea.getValue()});
    }
});

enyo.kind({
    name: "reader.fragment.ArticleToolbar",
    kind: "onyx.Toolbar",
    components: [
        {name: "name"},
        {
            kind: "onyx.MenuDecorator",
            onSelect: "itemSelected",
            components: [
                {content: "menu"},
                {kind: "onyx.Menu", components: [
                    {
                        name: "tagMenu",
                        kind: "enyo.Scroller",
                        defaultKind: "onyx.MenuItem",
                        vertical: "auto",
                        strategyKind: "TouchScrollStrategy",
                        components: [
                            {content: "aaaaa"},
                            {content: "bbbbbb"}
                        ]
                    }
                ]}
            ]
        },
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
    }
});


