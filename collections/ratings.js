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
        sanitizedObj.scores.convincingScore = parseInt(sanitizedObj.scores.convincingScore);
        sanitizedObj.scores.readabilityScore = parseInt(sanitizedObj.scores.readabilityScore);
        if(sanitizedObj.urlReview && !sanitizedObj.urlReview.match(urlRegExp)){
            throw new Meteor.Error(
                'Url needs to be of type ftp://..., http://..., or https://...');
        }

        var rating = Ratings.findOne({
            userId: user._id,
            ideologyId: sanitizedObj.ideologyId,
            ratingType: sanitizedObj.ratingType,
            worksId: sanitizedObj.worksId
        });

        if(rating){
            ratings_.updateOldReview(rating, sanitizedObj);
        } else {
            var ratingId = ratings_.createNewIdeologyRating(sanitizedObj, user._id);
            if(sanitizedObj.urlReview) Ratings.update(ratingId, {$set: {urlReview: sanitizedObj.urlReview}});
        }
    },
    'addNewAreaRatingOrChangeOld': function(attr){
        console.log(attr);
        var sanitizedObj = o_.sanitizeObject(_.omit(attr, 'scores'));
        sanitizedObj.scores = o_.sanitizeObject(attr.scores);

        var user = get_.userOrThrowError(),
            rating = Ratings.findOne({
                userId: user._id,
                policyAreaId: sanitizedObj.policyAreaId,
                worksId: sanitizedObj.worksId
            });

        if(rating){
            Ratings.update({_id: rating._id}, {$set: {scores: sanitizedObj.scores, familiarity: sanitizedObj.familiarity,
                dateWhenRated: new Date()}});
        } else {
            var ratingId = ratings_.createNewPolicyRating(sanitizedObj, user._id);
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
        }
    }
});


ratings_.createNewIdeologyRating = function(attr, userId){
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

ratings_.updateOldReview = function(rating, sanitizedObj){
    Ratings.update({_id: rating._id}, {
        $set: {
            scores: sanitizedObj.scores,
            familiarity: sanitizedObj.familiarity,
            date: new Date()
        },
        $addToSet: {
            oldReviews: {
                date: rating.date,
                scores: rating.scores}
        }
    });


    if(sanitizedObj.urlReview){
        Ratings.update(rating._id, {
            $set: {
                urlReview: sanitizedObj.urlReview
            }
        });
    }
};