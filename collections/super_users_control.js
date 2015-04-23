Meteor.methods({
    getFiveUpdates: function(){
        if(Meteor.isServer){
            var user = get_.userOrThrowError();
            if(!user.updates){
                user.updates = {};
                user.updates.lastChecked = new Date(2014, 3, 16);
            }
            var fiveRatings = [];

            var ideologies = Ideologies.find({proponents: user._id}, {fields: {_id: 1}}).fetch();
            if(ideologies.length > 0){
                _.each(ideologies, function(ideology){
                    var ratings = Ratings.find({ideologyId: ideology._id, userId: {$ne: user._id},
                    date: {$gte: user.updates.lastChecked}},  {sort: {date: -1}}).fetch();

                    if(ratings.length > 0){
                        fiveRatings = fiveRatings.concat(ratings.slice(0,4));
                    }
                });
            }

            fiveRatings = fiveRatings.slice(0,4);

            _.each(fiveRatings, function(rating){
                if(_.indexOf(user.updates.checkedRatings, rating._id) !== -1){
                    rating.checked = true;
                }
            });

            return fiveRatings;
        }
    }
});