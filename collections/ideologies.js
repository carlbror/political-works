Ideologies = new Meteor.Collection('ideologies');
Ideologies.attachSchema(Schemas.Ideologies);

Ideologies.allow({
    insert: function (userId) {
        return !!userId;
    }
});


Meteor.methods({
    stopSubscribingToIdeology: function(ideologyName){
        ideologyName = o_.sanitizeString(ideologyName);
        console.log("hello");

        var user = get_.userOrThrowError();
        var ideology = Ideologies.findOne({name: ideologyName});

        Ideologies.update({_id: ideology._id}, {$pull: {proponents: user._id}});
        Meteor.users.update({_id: user._id}, {$pull: {ideologies: ideology._id}});
    },

    createIdeology: function(name){
        name = o_.sanitizeString(name);
        var user = get_.userOrThrowError();

        return ideologies_.createIdeology(name)
    },
    addAdherent: function(ideologyId){
        ideologyId = o_.sanitizeString(ideologyId)

        var user = get_.userOrThrowError();
        var ideology = get_.ideologyOrThrowError(ideologyId);
        o_.throwIfUserAlreadySubscribesToThisIdeology(user, ideology._id);
        o_.throwIfIdeologyAlreadyHasUserAsAdherent(ideology, user._id);

        Meteor.users.update(user._id, {$push: {ideologies: ideology._id}});
        Ideologies.update({_id: ideology._id}, {$push: {proponents: user._id}});
    }
});
