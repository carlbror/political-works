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
    },
    changeWorks: function(attr){
        var user = get_.userOrThrowError();
        if(user._id !== "dib2n7TByrgDmxvQL" && user._id !== "5LgPbnMYcT8zGB367") throwError("Only admin can change this");
        attr = o_.sanitizeObject(attr);

        if(attr.producers){
            Works.update(attr.worksId, {$set: {producers: producers_.createNewProducers(attr.producers.split(','))}});
        }

        if(attr.url){
            Works.update(attr.worksId, {$set: {url: attr.url}});
        }

        if(attr.discussionUrl){
            Works.update(attr.worksId, {$set: {discussionUrl: attr.discussionUrl}});
        }

        if(attr.title){
            Works.update(attr.worksId, {$set: {title: attr.title}});
            return attr.title;
        }
    }
});
