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
