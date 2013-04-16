enyo.kind({
    name: "App",
    components: [
        {kind: "root"}
    ]
});

enyo.kind({
    name: "root",
    kind: "Panels",
    classes: "panels enyo-fit app-panels",
    arrangerKind: "CollapsingArranger",
    components: [
        {kind: "PanelA"},
        {kind: "PanelB"}
    ]
});

enyo.kind({
    name: "PanelA",
    kind: "Panels",
    fit: true,
    components: [{
        name: "content",
        style: "background-color: blue;",
        content: "aaaa"
    }]
});

enyo.kind({
    name: "PanelB",
    kind: "Panels",
    fit: true,
    components: [{
        name: "content",
        style: "background-color: green;",
    }]
});
