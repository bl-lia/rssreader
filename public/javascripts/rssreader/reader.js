enyo.kind({
    name: "App",
    kind: "Panels",
    fit: true,
    components: [
        {
            kind: "Panels",
            name: "mainPanel",
            classes: "panels enyo-fit panel-collapsible",
            arrangerKind: "CollapsingArranger",
            components: [
                {
                    kind: "Panels",
                    name: "navPanel",
                    classes: "panels enyo-fit panel-nav",
                    components: [
                        {kind: "reader.fragment.Feeds", name: "feeds", onShowArticlepanel: "showArticlePanel"}
                    ]
                },
                {name: "contentPanel", kind: "reader.fragment.MainPanel", classes: "panels enyo-fit panel-main"}
            ]
        }
    ],
    setFeed: function(feed){
        this.$.contentPanel.setFeed(feed);
    },
    refreshArticle: function(article){
        this.$.contentPanel.refreshArticle(article);
    },
    showArticlePanel: function(inSender, inEvent){
        this.$.mainPanel.next();
    }
});

