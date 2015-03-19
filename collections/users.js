Meteor.users.deny({update: function () { return true; }});

Meteor.methods({
    'isSameUser': function(currentUserId, visitedUserId){
        if(Meteor.isServer){
            var currentUser = Meteor.users.findOne(currentUserId),
                visitedUser = Meteor.users.findOne(visitedUserId);

            if(currentUser && currentUser.services && currentUser.services.facebook && currentUser.services.facebook.email && visitedUser && visitedUser.profile && visitedUser.profile.email
                && currentUser.services.facebook.email === visitedUser.profile.email){
                return true;
            }

            if(currentUser && currentUser.profile && currentUser.profile.email && visitedUser && visitedUser.services && visitedUser.services.facebook && visitedUser.services.facebook.email &&
                currentUser.profile.email === visitedUser.services.facebook.email ){
                return true;
            }
        }
    },
    'mergeAccounts': function (currentUserId, visitedUserId, password) {
        if (Meteor.isServer) {
            if(password === secrets.discussionUrlPassword){
                var visitedUser = Meteor.users.findOne(visitedUserId),
                    currentUser = Meteor.users.findOne(currentUserId);



                if (visitedUser.services.facebook) {
                    Meteor.users.remove(visitedUserId);
                    Meteor.users.update(currentUserId, {$set: {"services.facebook": visitedUser.services.facebook}});
                    Meteor.users.update(currentUserId, {$set: {"profile.mergedWithFaceBook": true}});
                    if (!currentUser.profile.name) {
                        Meteor.users.update(currentUserId, {$set: {"profile.name": visitedUser.profile.name}});
                    }
                } else if (visitedUser.services && visitedUser.services.password) {
                    Meteor.users.update(currentUserId, {$set: {"services.password": visitedUser.services.password,
                        "services.resume": visitedUser.services.resume}});
                }
            }
        }
    }
});