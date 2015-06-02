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

        if(attr.scores){
            sanitizedObj.scores = o_.sanitizeObject(attr.scores);
            if(sanitizedObj.scores.convincingScore) sanitizedObj.scores.convincingScore = parseInt(sanitizedObj.scores.convincingScore);
            if(sanitizedObj.scores.enlighteningScore) sanitizedObj.scores.enlighteningScore = parseInt(sanitizedObj.scores.enlighteningScore);
            if(sanitizedObj.scores.readabilityScore) sanitizedObj.scores.readabilityScore = parseInt(sanitizedObj.scores.readabilityScore);
        }
        sanitizedObj.familiarity = parseInt(sanitizedObj.familiarity);

        if(sanitizedObj.urlReview && !sanitizedObj.urlReview.match(urlRegExp)){
            throw new Meteor.Error(
                'Url needs to be of type ftp://..., http://..., or https://...');
        }

        if(sanitizedObj.ideologyId){
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
        } else if(sanitizedObj.policyId){
            var rating = Ratings.findOne({
                userId: user._id,
                policyId: sanitizedObj.policyId,
                ratingType: sanitizedObj.ratingType,
                worksId: sanitizedObj.worksId
            });
            if(rating){
                ratings_.updateOldReview(rating, sanitizedObj);
            } else {
                var ratingId = ratings_.createNewPolicyRating(sanitizedObj, user._id);
                if(sanitizedObj.urlReview) Ratings.update(ratingId, {$set: {urlReview: sanitizedObj.urlReview}});
            }
        } else if(sanitizedObj.policyAreaId){
            var rating = Ratings.findOne({
                userId: user._id,
                policyAreaId: sanitizedObj.policyAreaId,
                worksId: sanitizedObj.worksId
            });
            if(rating){
                ratings_.updateOldReview(rating, sanitizedObj);
            } else {
                var ratingId = ratings_.createNewAreaRating(sanitizedObj, user._id);
                if(sanitizedObj.urlReview) Ratings.update(ratingId, {$set: {urlReview: sanitizedObj.urlReview}});
            }
        } else if(sanitizedObj.scienceId){
            var rating = Ratings.findOne({
                userId: user._id,
                scienceId: sanitizedObj.scienceId,
                worksId: sanitizedObj.worksId
            });
            if(rating){
                ratings_.updateOldReview(rating, sanitizedObj);
            } else {
                var ratingId = ratings_.createNewScienceRating(sanitizedObj, user._id);
                if(sanitizedObj.urlReview) Ratings.update(ratingId, {$set: {urlReview: sanitizedObj.urlReview}});
            }
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

ratings_.createNewAreaRating = function(attr, userId){
    return Ratings.insert({
        policyAreaId: attr.policyAreaId,
        worksId: attr.worksId,
        userId: userId,
        scores: attr.scores,
        familiarity: attr.familiarity,
        date: new Date()
    });
};

ratings_.createNewScienceRating = function(attr, userId){
    return Ratings.insert({
        scienceId: attr.scienceId,
        worksId: attr.worksId,
        userId: userId,
        scores: attr.scores,
        familiarity: attr.familiarity,
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
                scores: rating.scores,
                familiarity: rating.familiarity
            }
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