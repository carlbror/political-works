Classifications = new Meteor.Collection("classification");

Classifications.allow({
    insert: function (userId) {
        return !!userId;
    }
});

Meteor.methods({
    addWikiClassification: function(){
        Classifications.insert({
            style: "Wikipedia",
            science: [


            ],
            history: [],
            ethics: []
        });
    }
});