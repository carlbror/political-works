Ideologies = new Meteor.Collection('ideologies');

Ideologies.allow({
    insert: function (userId) {
        return !!userId;
    }
});


Meteor.methods({
    stopSubscribingToIdeology: function(ideologyName){
        var user = get_.userOrThrowError();
        var ideology = Ideologies.findOne({name: ideologyName});

        Ideologies.update({_id: ideology._id}, {$pull: {proponents: user._id}});
        Meteor.users.update({_id: user._id}, {$pull: {ideologies: ideology._id}});
    },

    createIdeology: function(name){
        var user = get_.userOrThrowError();
        name = o_.capitaliseFirstLetter(name);

        var ideology = Ideologies.findOne({name: name});

        if(ideology){
            return ideology._id;
        } else {
            var ideologyId = Ideologies.insert({
                name: name,
                dateAdded: new Date()
            });
            return ideologyId;
        }
    },
    addAdherent: function(ideologyId){
        var user = get_.userOrThrowError();
        var ideology = get_.ideologyOrThrowError(ideologyId);
        o_.throwIfUserAlreadySubscribesToThisIdeology(user, ideology._id);
        o_.throwIfIdeologyAlreadyHasUserAsAdherent(ideology, user._id);

        Meteor.users.update(user._id, {$push: {ideologies: ideology._id}});
        Ideologies.update({_id: ideology._id}, {$push: {proponents: user._id}});
    }
});