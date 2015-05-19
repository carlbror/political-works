Lists = new Meteor.Collection('lists');
Lists.attachSchema(Schemas.Lists);

Lists.allow({
    insert: function(userId){
        return !!userId;
    }
});

Meteor.methods({
    createNewList: function(necessaryWorks, essentialWorks, nameForList){
        return Lists.insert({
            createdBy: get_.userOrThrowError()._id,
            name: o_.sanitizeString(nameForList),
            necessaryWorks: o_.sanitizeArray(necessaryWorks),
            essentialWorks: o_.sanitizeArray(essentialWorks),
            date: new Date()
        });
    }
});