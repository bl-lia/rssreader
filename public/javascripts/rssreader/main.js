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
    name: "reader.fragment.Articles",
    components: [
        {
            name: "list",
            kind: "List",
            classes: "list-articles-list",
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
    events: {
        onUpdateSelectedItem: "",
    },
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
                {name: "tag", kind: "reader.fragment.FeedTag", ontap: "updateSelectedItem"}
            ]
        }
    ],
    tags: [],
    selectedItem: "",
    setupItem: function(inSender, inEvent){
        var i = inEvent.index;
        var selected = inSender.isSelected(i);
        
        this.$.tag.setTag(this.tags[i]);
        this.$.tag.addRemoveClass("selected", selected);
    },
    refreshTags: function(tags){
        this.tags = tags;
        this.$.list.setCount(tags.length);
        this.$.list.refresh();
    },
    refreshFeedSelectedTags: function(selectedTags){
        for(var i=0; i<selectedTags.length; i++){
            var selectedTag = selectedTags[i];
            
            for(var s=0; s<this.tags.length; s++){
                if(this.tags[s]._id == selectedTag)
                    this.$.list.select(s);
            }
        }
        this.$.list.refresh();
    },
    updateSelectedItem: function(inSender, inEvent){
        var updFeeds = function(feedtags){
            var listSelected = feedtags.$.list.getSelection().getSelected();
            if(feedtags.selectedItem !== listSelected){
                feedtags.selectedItem = listSelected;
                var sendData = new Array();
                for(var i=0; i<feedtags.tags.length; i++){
                    if(feedtags.selectedItem[i] !== undefined){
                        sendData.push(feedtags.tags[i]);
                    }
                }
                
                feedtags.doUpdateSelectedItem({selectedItem: sendData});
            }
        };
        
        setTimeout(updFeeds, 2000, this);
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
    classes: "enyo-border-box list-feedtags-item",
    components: [
        {name: "name", classes: "tagname"}
    ],
    feedTag: "",
    setTag: function(tag){
        this.feedTag = tag;
        this.$.name.setContent(tag.name);
    },
});
