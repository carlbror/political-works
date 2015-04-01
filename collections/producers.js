Producers = new Meteor.Collection('producers');

Producers.allow({
    insert: function(userId) {
        return !!userId;
    }
});

Meteor.methods({
});

