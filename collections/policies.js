Policies = new Meteor.Collection('policies');

Policies.allow({
    insert: function(userId) {
        return !!userId;
    }
});


Meteor.methods({
    createPolicy: function(attr){
        var user = get_.userOrThrowError();
        attr.solution = o_.capitaliseFirstLetter(attr.solution);

        var policy = Policies.findOne({solution: attr.solution, placeId: attr.placeId});

        if (policy) {
            return policy._id;
        } else {
            return Policies.insert({
                solution: attr.solution,
                proposer: user._id,
                summary: attr.summary,
                placeId: attr.placeId,
                dateAdded: new Date()
            });
        }
    }
});

