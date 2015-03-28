Ratings = new Meteor.Collection('ratings');

Ratings.allow({
    insert: function(userId) {
        return !!userId;
    }
});


Meteor.methods({
    addNewRatingOrChangeOld: function(attr){
        var user = get_.userOrThrowError();

        if(attr.ideologyId){
            var rating = Ratings.findOne({userId: user._id, ideologyId: attr.ideologyId, ratingType: attr.ratingType, worksId: attr.worksId});

            if(rating){
                Ratings.update({_id: rating._id}, {$set: {scores: attr.scores, familiarity: attr.familiarity,
                    dateWhenRated: new Date()}});
                if(attr.urlReview) Ratings.update(rating._id, {$set: {urlReview: attr.urlReview}});
            } else {
                var ratingId = ratings_.createNewRating(attr, user._id);
                if(attr.urlReview) Ratings.update(ratingId, {$set: {urlReview: attr.urlReview}});
            }
        } else if(attr.policyId){
            var  rating = Ratings.findOne({
                userId: user._id,
                policyId: attr.policyId,
                ratingType: attr.ratingType,
                worksId: attr.worksId
            });

            if(rating){
                Ratings.update({_id: rating._id}, {$set: {scores: attr.scores, familiarity: attr.familiarity,
                    dateWhenRated: new Date()}});
                if(attr.urlReview) Ratings.update(rating._id, {$set: {urlReview: attr.urlReview}});
            } else {
                var ratingId = ratings_.createNewPolicyRating(attr, user._id);
                if(attr.urlReview) Ratings.update(rating._id, {$set: {urlReview: attr.urlReview}});
            }

        }
    },
    'addNewPolicyRatingOrChangeOld': function(attr){
        var user = get_.userOrThrowError(),
            rating = Ratings.findOne({
            userId: user._id,
            policyId: attr.policyId,
            ratingType: attr.ratingType,
            worksId: attr.worksId
        });

        if(rating){
            Ratings.update({_id: rating._id}, {$set: {scores: attr.scores, familiarity: attr.familiarity,
                dateWhenRated: new Date()}});
        } else {
            var ratingId = ratings_.createNewPolicyRating(attr, user._id);
            Meteor.users.update({_id: user._id}, {$push: {"services.policyRatings": ratingId}});
        }
    }
});



ratings_.createNewRating = function(attr, userId){
    return Ratings.insert({
        ideologyId: attr.ideologyId,
        worksId: attr.worksId,
        userId: userId,
        scores: attr.scores,
        familiarity: attr.familiarity,
        ratingType: attr.ratingType,
        date: new Date()
    });
};

ratings_.createNewPolicyRating = function(attr, userId){
    return Ratings.insert({
        policyId: attr.policyId,
        worksId: attr.worksId,
        userId: userId,
        scores: attr.scores,
        familiarity: attr.familiarity,
        ratingType: attr.ratingType,
        date: new Date()
    });
};
