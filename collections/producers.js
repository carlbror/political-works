Producers = new Meteor.Collection('producers');

Producers.allow({
    insert: function(userId) {
        return !!userId;
    }
});


Meteor.methods({
    createProducer: function(producerName){
        var producer = Producers.findOne({name: producerName});

        if(producer) return producer._id;
        else return Producers.insert({
            name: producerName
        });
    }
});

