Meteor.methods({
    getUpdates: function(){
        if(Meteor.isServer){
            var user = get_.userOrThrowError();
            if(!user.updates){
                user.updates = {};
                user.updates.lastChecked = new Date(2010, 1, 1);
            }

            var ideologies = Ideologies.find({proponents: user._id}, {fields: {_id: 1}}).fetch();
            if(ideologies.length > 0){
                _.each(ideologies, function(ideology){
                    var ratings = Ratings.find({ideologyId: ideology._id, userId: {$ne: user._id},
                    date: {$gte: user.updates.lastChecked}},  {sort: {date: -1}}).fetch();

                    if(ratings.length > 0){
                        console.log(ratings);
                        return ratings;
                    }
                });
            }
        }
    }
});