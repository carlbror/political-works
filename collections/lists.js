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
            necessaryWorks: o_.sanitizeArray(necessaryWorks),
            essentialWorks: o_.sanitizeArray(essentialWorks),
            subscribers: [user._id],
            date: new Date()
        });
    }
});