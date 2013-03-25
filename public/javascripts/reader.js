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
        var feedId = this.feeds[i]._id;
        
        socket.emit('load feed articles', {id: feedId});
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
            classes: "list-articles-list",
            count: 0,
            onSetupItem: "setupItem",
            multiSelect: true,
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
        {name: "date"},
        {name: "title"},
        {name: "description", classes: "description", allowHtml: true}
    ],
    setSelected: function(inSelected){
        this.addRemoveClass("expandable", !inSelected);
        this.addRemoveClass("expandable-selected", inSelected);
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