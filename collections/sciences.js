Sciences = new Meteor.Collection('sciences');
Sciences.attachSchema(Schemas.Sciences);

Sciences.allow({
    insert: function(userId){
        return !!userId;
    }
});

Meteor.methods({
    addNewScience: function(field){
        Sciences.insert({
            field: {
                english: field
            }
        })
    }
});