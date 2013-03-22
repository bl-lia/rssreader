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
                    classes: "panels enyo-fit",
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
                            kind: "Panels",
                            name: "articlePanel",
                            classes: "panels enyo-fit article-panel",
                            components: [
                                {kind: "Scroller", components: [
                                    {kind: "reader.fragment.Articles", name: "articles"}
                                ]}
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
            count: 0,
            onSetupItem: "setupItem",
            components: [
                {
                    name: "item",
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
        this.$.name.setContent(this.feeds[inEvent.index].name);
    },
    itemTap: function(inSender, inEvent){
        var i = inEvent.index;
        var xmlUrl = this.feeds[i].xmlUrl;
        
        socket.emit('load feed articles', {url: xmlUrl});
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
            content: "aaaa"
        },
        {
            name: "list",
            kind: "List",
            count: 0,
            onSetupItem: "setupItem",
            components: [
                {kind: "reader.fragment.Article", name: "article", ontap: "itemTap"},
            ]
        }
    ],
    articles: [],
    setupItem: function(inSender, inEvent){
        var i = inEvent.index;
        
        this.$.article.$.title.setContent(this.articles[i].title);
        this.$.article.$.date.setContent(this.articles[i].date);
        this.$.article.$.description.setContent(this.articles[i].description);
        this.$.article.$.description.hide();
    },
    itemTap: function(inSender, inEvent){
        var i = inEvent.index;
        var link = this.articles[i].link;
        
        //window.open(link, '_blank');
        
        console.log(i);
        this.$.article.$.description.setShowing(!this.$.article.$.description.showing);
    },
    refreshItem: function(data){
        this.articles = data;
        this.$.list.setCount(this.articles.length);
        this.$.list.refresh();
    }
});

enyo.kind({
    name: "reader.fragment.Article",
    classes: "enyo-border-box",
    components: [
        {name: "date"},
        {name: "title"},
        {name: "description", allowHtml: true}
    ]
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