enyo.kind({
    name: "App",
    kind: "Panels",
    fit: true,
    components: [
        {kind: "root"}    
    ]
});

enyo.kind({
    name: "root",
    kind: "FittableRows",
    components: [
        {kind: "collapsiblePanels", onTapAAA: "tapaaa", onTapBBB: "tapbbb"}
    ],
    tapaaa: function(){
        this.$.collapsiblePanels.next();
    },
    tapbbb: function(){
        this.$.collapsiblePanels.previous();
    }
});

enyo.kind({
    name: "collapsiblePanels",
    kind: "Panels",
    fit: true,
    events: {
        onTapAAA: "",
        onTapBBB: "",
    },
    arrangerKind: "CollapsingArranger",
    fit: true,
    realtimeFit: true,
    components: [
        {style:"background:blue;", components: [{kind: "onyx.Button", content: "0", ontap: "tapaaa"}]},
        {style:"background:green;", components: [{kind: "onyx.Button", content: "1", ontap: "tapbbb"}]}
    ],
    tapaaa: function(){
        this.doTapAAA();
    },
    tapbbb: function(){
        this.doTapBBB();
    }
});

enyo.kind({
    name: "enyo.sample.PanelsSample",
	classes: "enyo-fit",
	components: [
		{kind: "Panels", name:"samplePanels", arrangerKind: "CollapsingArranger", fit:true, realtimeFit: true, classes: "panels-sample-panels enyo-border-box", components: [
			{style:"background:red;", components: [{kind: "onyx.Button", content: "0", ontap: "tap0"}]},
			{content:1, style:"background:orange;"},
			{content:2, style:"background:yellow;"},
			{content:3, style:"background:green;"},
			{content:4, style:"background:blue;"},
			{content:5, style:"background:indigo;"},
			{content:6, style:"background:violet;"}
		]}
	],
	bgcolors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
	rendered: function() {
		this.inherited(arguments);
	},
	arrangerSelected: function(inSender, inEvent) {
		var sp = this.$.samplePanels;
		var p = this.panelArrangers[inEvent.originator.indexInContainer()-1];
		if (this.currentClass) {
			sp.removeClass(this.currentClass);
		}
		if (p.classes) {
			sp.addClass(p.classes);
			this.currentClass = p.classes;
		}
		sp.setArrangerKind(p.arrangerKind);
		if (enyo.Panels.isScreenNarrow()) {
			this.setIndex(1);
		}
	},
	// panels
	prevPanel: function() {
		this.$.samplePanels.previous();
		this.$.input.setValue(this.$.samplePanels.index);
	},
	nextPanel: function() {
		this.$.samplePanels.next();
		this.$.input.setValue(this.$.samplePanels.index);
	},
	gotoPanel: function() {
		this.$.samplePanels.setIndex(this.$.input.getValue());
	},
	panelCount: 0,
	addPanel: function() {
		var sp = this.$.samplePanels;
		var i = this.panelCount++;
		var p = sp.createComponent({
			style:"background:" + this.bgcolors[i % this.bgcolors.length],
			content:i
		});
		p.render();
		sp.reflow();
		sp.setIndex(i);
	},
	deletePanel: function() {
		var p = this.$.samplePanels.getActive();
		if (p) {
			p.destroy();
		}
	},
    tap0: function(inSender, inEvent){
        this.$.samplePanels.next();
    }
});