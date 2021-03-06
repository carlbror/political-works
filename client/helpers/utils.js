sanitizeHtml = function(string, object){
    return string;
};

addSortedRatingsOnIdeology = function(ratings){
    var valuableWorks = [];

    for(var x = 0; x < ratings.length; x++){
        var valuableWork = ratings[x].worksId;
        var possibleWorksId = _.where(valuableWorks, {worksId: valuableWork});
        if(possibleWorksId[0]){

        } else {
            var allRatings = _.where(ratings, {worksId: valuableWork});
            var scoresOfOneWorksId = _.pluck(allRatings, 'score');
            var totalRating = _.reduce(scoresOfOneWorksId, function(memo, num){ return memo + num; }, 0) / scoresOfOneWorksId.length;
            valuableWorks.push({worksId: valuableWork, totalRating: totalRating});
        }
    }
    valuableWorks.sort(function (a, b) {
        return b.totalRating - a.totalRating;
    });

    return valuableWorks;
};

calculateTotalScoreForRatingsAndSort = function(ratings, scoreType){
    var valuableWorks = [];

    for(var x = 0; x < ratings.length; x++){
        var possibleWorksId = _.where(valuableWorks, {worksId: ratings[x].worksId});
        if(possibleWorksId[0]){

        } else {
            var scoresOnAWork = _.pluck(_.pluck(_.where(ratings, {worksId: ratings[x].worksId}), 'scores'), scoreType);
            var newTotalRating = 0;
            _.each(scoresOnAWork, function(score){
                newTotalRating += parseInt(score);
            });
            var totalRating = newTotalRating / scoresOnAWork.length;
            valuableWorks.push({worksId: ratings[x].worksId, totalRating: totalRating});
        }
    }

    valuableWorks.sort(function (a, b) {
        return b.totalRating - a.totalRating;
    });

    return valuableWorks;
};

putTheTwoTypesOfWorksReviewsOnAPolicy = function(policyId, scoreType, typeOfWork, familiarities){
    var policy = Policies.findOne(policyId);
    if(policy) {
        var ratings = Ratings.find({policyId: policy._id,  $and: [
                {familiarity: {$gt: 0}},
                {familiarity: {$in: familiarities}}
            ]},
            {fields: {worksId: 1, scores: 1, ratingType: 1, familiarity: 1}}).fetch();

        if(typeOfWork !== "all"){
            var arrayOfSelectedTypes = typeOfWork.split(',');

            _.each(ratings, function(rating){
                var work = Works.findOne(rating.worksId, {fields: {type:1}});
                if(!_.contains(arrayOfSelectedTypes, work.type)){
                    ratings = _.without(ratings, rating);
                }
            });
        }

        var positiveRatings = _.where(ratings, {ratingType: "for"}),
            criticalRatings = _.where(ratings, {ratingType: "against"}),
            enlighteningRatings = _.where(ratings, {ratingType: "enlightening"});

        policy.enlighteningWorks = calculateTotalScoreForRatingsAndSort(enlighteningRatings, scoreType);
        policy.positiveWorks = calculateTotalScoreForRatingsAndSort(positiveRatings, scoreType);
        policy.criticalWorks = calculateTotalScoreForRatingsAndSort(criticalRatings, scoreType);
        return policy;
    }
};


putTheFourTypesOfWorksReviewsOnAnIdeology = function(ideologyName, scoreType, typeOfWork, familiarity){
    var ideology = Ideologies.findOne({name: ideologyName});
    if(ideology) {
        var ratings = Ratings.find({ideologyId: ideology._id,  $and: [
                {familiarity: {$gt: 0}},
                {familiarity: {$in: familiarity}}
            ]},
            {fields: {worksId: 1, scores: 1, ratingType: 1, userId: 1, familiarity: 1}}).fetch();

        if(typeOfWork !== "all"){
            var arrayOfSelectedTypes = typeOfWork.split(',');
            _.each(ratings, function(rating){
                var work = Works.findOne(rating.worksId, {fields: {type:1}});
                if(!_.contains(arrayOfSelectedTypes, work.type)){
                    ratings = _.without(ratings, rating);
                }
            });
        }

        var positiveRatings = _.where(ratings, {ratingType: "positive"}),
            criticalRatings = _.where(ratings, {ratingType: "critical"}),
            enlighteningRatings = _.where(ratings, {ratingType: "enlightening"});

        var proponentsPositiveRatings = [],
            othersPositiveRatings = [],
            proponentsCriticalRatings = [],
            othersCriticalRatings = [],
            proponentsEnlighteningRatings = [],
            othersEnlighteningRatings = [];


        _.each(enlighteningRatings, function(rating){
            if(_.contains(this, rating.userId)){
                proponentsEnlighteningRatings.push(rating);
            } else {
                othersEnlighteningRatings.push(rating);
            }
        }, ideology.proponents);

        _.each(positiveRatings, function(rating) {
            if(_.contains(this, rating.userId)){
                proponentsPositiveRatings.push(rating);
            } else {
                othersPositiveRatings.push(rating);
            }
        }, ideology.proponents);

        _.each(criticalRatings, function(rating) {
            if(_.contains(this, rating.userId)){
                proponentsCriticalRatings.push(rating);
            } else {
                othersCriticalRatings.push(rating);
            }
        }, ideology.proponents);

        ideology.proponentsEnlighteningWorks = calculateTotalScoreForRatingsAndSort(proponentsEnlighteningRatings, scoreType);
        ideology.othersEnlighteningWorks = calculateTotalScoreForRatingsAndSort(othersEnlighteningRatings, scoreType);
        ideology.proponentsPositiveWorks = calculateTotalScoreForRatingsAndSort(proponentsPositiveRatings, scoreType);
        ideology.othersPositiveWorks = calculateTotalScoreForRatingsAndSort(othersPositiveRatings, scoreType);
        ideology.proponentsCriticalWorks = calculateTotalScoreForRatingsAndSort(proponentsCriticalRatings, scoreType);
        ideology.othersCriticalWorks = calculateTotalScoreForRatingsAndSort(othersCriticalRatings, scoreType);

        return ideology;
    }
};

checkItContainsEverything = function (attr) {
    _.each(attr, function (property) {
        if (!property || property.length < 1) throwError("Error occurred. Might be because you haven't filled in all " +
            "fields or because there's something wrong with the code. If the error persists, would you inform me on the " +
            "front page, please?");

        if(_.isArray(property) && !property[0]) throwError("You must fill in all fields");
    });
};




utils_.putPositiveAndCriticalIdeologyRatingsOnUser = function (user, ratings, score) {
    var positiveIdeologiesRatings = [],
        criticalIdeologiesRatings = [],
        positivePoliciesRatings = [],
        criticalPoliciesRatings = [];

    _.each(ratings, function (rating) {
        if (rating.ideologyId) {
            var ideologyId = rating.ideologyId;

            var possibleIdeologyId = _.where(positiveIdeologiesRatings, {ideologyId: ideologyId});
            //duplicate maybe this for the criticalIdeologiesRatings and have an either just below?

            if (possibleIdeologyId[0]) {
            } else {
                var positiveRatings = _.where(ratings, {ideologyId: ideologyId, ratingType: "positive"});
                var criticalRatings = _.where(ratings, {ideologyId: ideologyId, ratingType: "critical"});

                if (positiveRatings[0]) {
                    positiveIdeologiesRatings.push({ideologyId: ideologyId, ratingType: "positive",
                        ratings: positiveRatings});
                }

                if (criticalRatings[0]) {
                    criticalIdeologiesRatings.push({ideologyId: ideologyId, ratingType: "critical",
                        ratings: criticalRatings});
                }
            }
        } else if (rating.policyId) {
            var policyId = rating.policyId;

            var possiblePolicyId = _.where(positivePoliciesRatings, {policyId: policyId});

            if (possiblePolicyId[0]) {
            } else {
                var positiveRatings = _.where(ratings, {policyId: policyId, ratingType: "for"});
                var criticalRatings = _.where(ratings, {policyId: policyId, ratingType: "against"});

                if (positiveRatings[0]) {
                    positivePoliciesRatings.push({policyId: policyId, ratingType: "for",
                        ratings: positiveRatings});
                }

                if (criticalRatings[0]) {
                    criticalPoliciesRatings.push({policyId: policyId, ratingType: "against",
                        ratings: criticalRatings});
                }
            }
        }
    });

    user.positiveRatingsOnIdeology = positiveIdeologiesRatings;
    user.criticalRatingsOnIdeology = criticalIdeologiesRatings;
    user.favorableRatingsOnPolicy = positivePoliciesRatings;
    user.unfavorableRatingsOnPolicy = criticalPoliciesRatings;


    if (user.positiveRatingsOnIdeology) {
        _.each(user.positiveRatingsOnIdeology, function (ratingsOnIdeology) {
            sortRatingsAccordingToTypeOfScore(ratingsOnIdeology, score);
        });
    }

    if (user.criticalRatingsOnIdeology) {
        _.each(user.criticalRatingsOnIdeology, function (ratingsOnIdeology) {
            sortRatingsAccordingToTypeOfScore(ratingsOnIdeology, score);
        });
    }

    if (user.favorableRatingsOnPolicy) {
        _.each(user.favorableRatingsOnPolicy, function (ratingsOnIdeology) {
            sortRatingsAccordingToTypeOfScore(ratingsOnIdeology, score);
        });
    }

    if (user.unfavorableRatingsOnPolicy) {
        _.each(user.unfavorableRatingsOnPolicy, function (ratingsOnIdeology) {
            sortRatingsAccordingToTypeOfScore(ratingsOnIdeology, score);
        });
    }

    user.hasRatingsOn = true;

    return user;
};

throwIfNotNumberOrNotBetween1and100 = function(rating){
    if(isNaN(rating)) throwError("The rating needs to be a number");
    else if(rating < 1 || rating > 100) throwError("The rating needs to be a number between 1 and 100");
};

throwIfVariablesInArrayNotNumbersOrNotBetween1and100 = function(array){
    _.each(array, function(rating){
        if(isNaN(rating)) throwError("The rating needs to be a number");
        else if(rating < 1 || rating > 100) throwError("The rating needs to be a number between 1 and 100");
    });
};



sortRatingsAccordingToTypeOfScore = function(ratings, score){
    switch(score){
        case "convincing-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.convincingScore - a.scores.convincingScore;
            });
            break;
        case "criticality-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.criticalityScore - a.scores.criticalityScore;
            });
            break;
            break;
        case "readability-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.readabilityScore - a.scores.readabilityScore;
            });
            break;
        case "explanation-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.explanationScore - a.scores.explanationScore;
            });
            break;
        case "completeness-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.completenessScore - a.scores.completenessScore;
            });
            break;
        case "background-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.backgroundScore - a.scores.backgroundScore;
            });
            break;
        case "new-info-score":
            ratings.ratings.sort(function (a, b) {
                return b.scores.newInfoScore - a.scores.newInfoScore;
            });
            break;
    }
};





utils_.howManyPercentageOfAllTheWorksHasThisUserRated = function(userId){
    var allWorks = Works.find().fetch(),
        allUserReviews = Ratings.find({userId: userId}).fetch();

    return 0;
};



