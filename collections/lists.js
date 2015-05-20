Lists = new Meteor.Collection('lists');
Lists.attachSchema(Schemas.Lists);

Lists.allow({
    insert: function(userId){
        return !!userId;
    }
});

Meteor.methods({
    createNewList: function(necessaryWorks, essentialWorks, nameForList){
        var user = get_.userOrThrowError();
        return Lists.insert({
            createdBy: user._id,
            name: o_.sanitizeString(nameForList),
            importantWorks: o_.sanitizeArray(necessaryWorks),
            essentialWorks: o_.sanitizeArray(essentialWorks),
            subscribers: [user._id],
            date: new Date()
        });
    },
    toggleSubscriptionToList: function(listId, isSubscribing){
        if(isSubscribing){
            Lists.update(listId, {$pull: {subscribers: get_.userOrThrowError()._id}});
        } else {
            Lists.update(listId, {$addToSet: {subscribers: get_.userOrThrowError()._id}});
        }
    }
});