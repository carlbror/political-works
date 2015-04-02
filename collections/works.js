Works = new Meteor.Collection('works');
Works.attachSchema(Schemas.Works);

Works.allow({
    insert: function (userId, doc) {
        return !!userId;
    }
});

Meteor.methods({
    'createWork': function(attr){
        var sanitizedProducers = o_.sanitizeArray(attr.producers),
            sanitizedObj = o_.sanitizeObject(_.omit(attr, 'producers'));
        sanitizedObj.producers = sanitizedProducers;


        sanitizedObj.title = o_.capitaliseFirstLetter(sanitizedObj.title);
        sanitizedObj.producers = producers_.createNewProducers(sanitizedObj.producers);

        var work = Works.findOne({title: sanitizedObj.title, producers: sanitizedObj.producers});
        if(work) return work._id;

        return Works.insert({
            title: sanitizedObj.title,
            producers: sanitizedObj.producers,
            url: sanitizedObj.url,
            discussionUrl: sanitizedObj.discussionUrl,
            type: sanitizedObj.type,
            date: new Date()
        });
    }
});