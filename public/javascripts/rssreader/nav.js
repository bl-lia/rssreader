enyo.kind({
    name: "reader.fragment.Feeds",
    kind: "FittableRows",
    components: [
        {
            kind: "FittableRows",
            fit: true,
            components: [
                {
                    name: "feedTagPanel",
                    kind: "Panels",
                    classes: "panels",
                    arrangerKind: "CardSlideInArranger",
                    fit: true,
                    components: [
                        {name: "feedlist", kind: "reader.fragments.FeedList"},
                        {name: "taglist", kind: "reader.fragments.TagList"}
                    ]
                },
            ]
        },
        {components: [
            {kind: "reader.fragment.NavigationToolbar", onTogglePanel: "togglePanel", onShowAddPanel: "showAddPanel"},
        ]},
        {
            name: "addPopup", kind: "reader.fragment.AddPopup"
        }
    ],
    refreshList: function(data){
        this.$.feedlist.feeds = data;
        this.$.feedlist.refreshList();
    },
    togglePanel: function(){
        if(this.$.feedTagPanel.index == 0)
            this.$.feedTagPanel.next();
        else
            this.$.feedTagPanel.previous();
    },
    addFeed: function(inSender, inEvent){
        socket.emit('add feed', {url: inEvent.url});
    },
    showAddPanel: function(){
        console.log("aaa");
        this.$.addPopup.show();
    }
});

enyo.kind({
    name: "reader.fragments.FeedList",
    components: [{
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
    }],
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
    refreshList: function(){
        this.$.list.setCount(this.feeds.length);
        this.$.list.refresh();
    }
});

enyo.kind({
    name: "reader.fragments.TagList",
    components: [{
        name: "list",
        kind: "List",
        classes: "list-tags-list",
        count: 0,
        onSetupItem: "setupItem",
        components: [
            {
                name: "item",
                classes: "list-tags-item",
                ontap: "itemTap",
                components: [
                    {name: "name"}
                ]
            }
        ]
    }],
    tags: [],
    setupItem: function(inSender, inEvent){
        var i = inEvent.index;
        
        this.$.name.setContent(this.tags[inEvent.index].name);
        this.$.item.addRemoveClass("list-tags-item-selected", inSender.isSelected(i));
    },
    itemTap: function(inSender, inEvent){
        var i = inEvent.index;
        
        socket.emit('load tagged articles', {tag: this.tags[i]});
    },
    refreshList: function(){
        this.$.list.setCount(this.tags.length);
        this.$.list.refresh();
    }
});

enyo.kind({
    name: "reader.fragment.AddFeedBox",
    kind: "onyx.MenuDecorator",
    events: {
        onAddFeed: ""
    },
    components: [
        {kind: "onyx.Button", content: "aaa"},
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
        this.doAddFeed({url: this.$.textArea.getValue()});
    }
});

enyo.kind({
    name: "reader.fragment.NavigationToolbar",
    kind: "onyx.Toolbar",
    classes: "toolbar",
    events: {
        onTogglePanel: "",
        onShowAddPanel: ""
    },
    components: [
        {kind: "onyx.Button", content: "+", ontap: "test"},
        {kind: "onyx.Button", content: "<>", ontap: "togglePanel"},
    ],
    togglePanel: function(){
        this.doTogglePanel();
    },
    test: function(){
        this.doShowAddPanel();
    }
});

enyo.kind({
    name: "reader.fragment.AddPanel",
    components: [
        {kind: "onyx.Button", content: "Add"}
    ]    
});

enyo.kind({
    name: "reader.fragment.AddPopup",
    kind: "onyx.Popup",
    centered: true,
    modal: true,
    floating: true,
    components: [
        {kind: "onyx.Input", placeholder: "Feed URL"},
        {kind: "onyx.Button", content: "Add"}
    ]
});

