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
            coAdmins: [user._id],
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
    },
    changeListComposition: function(listId, workId, checked, important){
        var user = get_.userOrThrowError(),
            list = Lists.findOne(listId);

        if(list && _.contains(list.coAdmins, user._id)){
            if(!checked){
                Lists.update({_id: listId}, {$pull: {essentialWorks: workId, importantWorks: workId}});
            } else {
                if(important){
                    Lists.update({_id: listId},{$addToSet:{importantWorks:workId}, $pull: {
                       essentialWorks: workId}});
                } else {
                    Lists.update({_id: listId},{$addToSet:{essentialWorks:workId}, $pull: {
                        importantWorks: workId}});
                }
            }
        }
    },
    addAdmin: function(listId, userId){
        var user = get_.userOrThrowError(),
            list = Lists.findOne(listId);

        if(list && _.contains(list.coAdmins, user._id)){
            Lists.update(list._id, {$addToSet: {coAdmins: userId}});
        }
    }
});