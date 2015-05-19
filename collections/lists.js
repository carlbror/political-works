Lists = new Meteor.Collection('lists');
Lists.attachSchema(Schemas.Lists);

Lists.allow({
    insert: function(userId){
        return !!userId;
    }
});

Meteor.methods({
    createNewList: function(necessaryWorks, essentialWorks){
        var user = get_.userOrThrowError();
        necessaryWorks = o_.sanitizeArray(neccesaryWorks);
        essentialWorks = o_.sanitizeArray(essentialWorks);

        Lists.insert({
            createdBy: user._id
        })



    }
});