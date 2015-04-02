Producers = new Meteor.Collection('producers');
Producers.attachSchema(Schemas.Producers);

Producers.allow({
    insert: function(userId) {
        return !!userId;
    }
});

Meteor.methods({
});

