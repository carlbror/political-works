Works = new Meteor.Collection('works');

Works.allow({
    insert: function (userId, doc) {
        return !!userId;
    }
});

Meteor.methods({
    'createWork': function(attr){
        attr.title = o_.capitaliseFirstLetter(attr.title);
        attr.producers = producers_.createNewProducers(attr.producers);

        var work = Works.findOne({title: attr.title, producers: attr.producers});
        if(work) return work._id;

        return Works.insert({
            title: attr.title,
            producers: attr.producers,
            url: attr.url,
            discussionUrl: attr.discussionUrl,
            type: attr.type,
            dateAdded: new Date()
        });
    }
});