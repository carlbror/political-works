Ratings = new Meteor.Collection('ratings');
Ratings.attachSchema(Schemas.Ratings);

Ratings.allow({
    insert: function(userId){
        return !!userId;
    }
});


Meteor.methods({
    addNewRatingOrChangeOld: function(attr){
        var user = get_.userOrThrowError(),
            sanitizedObj = o_.sanitizeObject(_.omit(attr, 'scores'));
        sanitizedObj.scores = o_.sanitizeObject(attr.scores);


        if(sanitizedObj.ideologyId){
            var rating = Ratings.findOne({userId: user._id, ideologyId: sanitizedObj.ideologyId, ratingType: sanitizedObj.ratingType, worksId: sanitizedObj.worksId});

            if(rating){
                Ratings.update({_id: rating._id}, {$set: {scores: sanitizedObj.scores, familiarity: sanitizedObj.familiarity,
                    dateWhenRated: new Date()}});
                if(sanitizedObj.urlReview) Ratings.update(rating._id, {$set: {urlReview: sanitizedObj.urlReview}});
            } else {
                var ratingId = ratings_.createNewRating(sanitizedObj, user._id);
                if(sanitizedObj.urlReview) Ratings.update(ratingId, {$set: {urlReview: sanitizedObj.urlReview}});
            }
        } else if(sanitizedObj.policyId){
            var rating = Ratings.findOne({
                userId: user._id,
                policyId: sanitizedObj.policyId,
                ratingType: sanitizedObj.ratingType,
                worksId: sanitizedObj.worksId
            });

            if(rating){
                Ratings.update({_id: rating._id}, {$set: {scores: sanitizedObj.scores, familiarity: sanitizedObj.familiarity,
                    dateWhenRated: new Date()}});
                if(sanitizedObj.urlReview) Ratings.update(rating._id, {$set: {urlReview: sanitizedObj.urlReview}});
            } else {
                var ratingId = ratings_.createNewPolicyRating(sanitizedObj, user._id);
                if(sanitizedObj.urlReview) Ratings.update(rating._id, {$set: {urlReview: sanitizedObj.urlReview}});
            }

        }
    },
    'addNewPolicyRatingOrChangeOld': function(attr){
        var sanitizedObj = o_.sanitizeObject(_.omit(attr, 'scores'));
        sanitizedObj.scores = o_.sanitizeObject(attr.scores);

        var user = get_.userOrThrowError(),
            rating = Ratings.findOne({
                userId: user._id,
                policyId: sanitizedObj.policyId,
                ratingType: sanitizedObj.ratingType,
                worksId: sanitizedObj.worksId
            });

        if(rating){
            Ratings.update({_id: rating._id}, {$set: {scores: sanitizedObj.scores, familiarity: sanitizedObj.familiarity,
                dateWhenRated: new Date()}});
        } else {
            var ratingId = ratings_.createNewPolicyRating(sanitizedObj, user._id);
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
