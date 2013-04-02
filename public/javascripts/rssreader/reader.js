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
                {name: "contentPanel", kind: "reader.fragment.MainPanel"}
            ]
        }
    ],
    setFeed: function(feed){
        this.$.contentPanel.setFeed(feed);
    },
    refreshArticle: function(article){
        this.$.contentPanel.refreshArticle(article);
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



